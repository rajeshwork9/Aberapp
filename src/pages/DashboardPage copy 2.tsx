import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../App';
import { StyleSheet, View, TouchableOpacity, ScrollView, ImageBackground, Image } from 'react-native';
import { Button, TextInput, Modal, Portal, Text, Card, PaperProvider, ActivityIndicator, SegmentedButtons } from 'react-native-paper';
import dayjs from 'dayjs';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import { getLicenceNumber, getTodaysTrips, getOverallClasses, getVehiclesList } from '../services/common';
import { useAccount } from '../context/AccountProvider';

interface Trip {
  AssetId: string;
  VRM: string;
  LocationName: string;
  TransactionId: string;
  TransactionDate: string; // ISO string
  AmountFinal: string;
  StatusId: number;
}

interface LPN {
  label: string;
  value: string;
  AssetIdentifier: string;
  OverallClassId: number;
}

interface VehicleItem {
  AssetIdentifier: string;
  AssetTypeId: number;
  AccountUnitId: number;
  StatusId: number;
  OverallClassId: number;
  ValidFromDate: string;   // ISO string
  ValidToDate: string | null;
  Vehicle?: any;
  RelatedAssetIdentifier?: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

const getClassColor = (className: string) => {
  switch (className) {
    case 'Unknown': return '#5AA9FF'; 
    case '2XL': return '#4E95F7';
    case '3XL': return '#276DCB';
    case '6 Wheels': return '#3EDC7E';
    case 'Light Vehicle': return '#FF8C00';
    case 'Bus': return '#8A2BE2';
    case 'Truck Head': return '#00BFFF';
    case 'Others': return '#999999';
    default: return '#CCCCCC';
  }
};


const DashboardPage: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { full } = useAccount();

  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const isFetchingMore = useRef(false);

  const [lpnValue, setLpnValue] = useState<any>(0);
  const [tripsData, setTripsData] = useState<Trip[]>([]);
  const [vehiclesData, setVehiclesData] = useState<VehicleItem[]>([]);
  const [accountDetails, setAccountDetails] = useState<any>();
  const [lpnData, setLpnData] = useState<LPN[]>([]);
  const [typesData, setTypesData] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [vehicleClassId, setVehicleClassId] = useState<number | 'all'>('all');
  

  /** Legend: always from getTypes (all classes) */
  const legendItems = useMemo(
    () => (typesData || []).map((t: any) => ({ label: t.ItemName, color: getClassColor(t.ItemName) })),
    [typesData]
  );

  const vehicleLegendItems = useMemo(() => {
  const base = (typesData || []).map((t: any) => ({
    classId: t.ItemId,
    label: t.ItemName,
    color: getClassColor(t.ItemName),
  }));

  const hasUnknown = (vehiclesData || []).some(v => v.OverallClassId === 0);
  return hasUnknown
    ? [{ classId: 0, label: 'Unknown', color: getClassColor('Unknown') }, ...base]
    : base;
}, [typesData, vehiclesData]);

  useEffect(() => setAccountDetails(full), [full]);

  useEffect(() => {
    if (!accountDetails) return;
    const load = async () => {
      try {
        const [typesRes, lpnRes] = await Promise.all([
          getOverallClasses(),
          getLicenceNumber({ accountId: accountDetails.AccountId, assetTypeId: 2 }),
        ]);
        setTypesData(typesRes || []);
        console.log("types data", typesData);
        
        const lpnFormatted = (lpnRes || []).map((item: any) => ({
          ...item,
          label: item.AssetIdentifier,
          value: item.AccountUnitId,
        }));
        setLpnData(lpnFormatted);

        await Promise.all([getTrips(), getVehicles()]);
      } catch (e) {
        console.error('Init load failed:', e);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountDetails]);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const getTrips = async () => {
    try {
      setLoading(true);
      const toDatetime = dayjs().endOf('day').format('YYYY-MM-DD');
      const payload = {
        accountId: accountDetails.AccountId,
        AccountUnitId: lpnValue ? lpnValue : 0,
        GantryId: 0,
        fromDate: `${dayjs().subtract(5, 'year').year()}-01-01`,   // current year only
        toDate: toDatetime,
        PageNumber: 1,
        PageSize: 1000,
      };
      console.log("payload", payload);

      const response = await getTodaysTrips(payload);
      const trips = response?.TransactionsList || [];

      console.log('📦 Raw Trips from API:', trips);

      setTripsData(trips);
    } catch (e) {
      console.error('Trips fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getVehicles = async () => {
    try {
      setLoading(true);

      const payload = {
        accountId: accountDetails.AccountId,
        AssetTypeId: 0,
        PageNumber: 1,
        PageSize: 1000,
      };

      const res = await getVehiclesList(payload);
      console.log(res, 'vehicle');
       // Build a set of valid class IDs from getTypes
    const validClassIds = new Set((typesData || []).map((t: any) => t.ItemId));
    // Keep only vehicles whose OverallClassId is in types
    const filtered = res.List.filter((v: any) => validClassIds.has(v.OverallClassId));

      setVehiclesData(res.List);
      const monthly = buildVehiclesMonthlySeries(filtered, vehicleClassId);
       const yearly  = buildVehiclesYearlySeries(filtered, vehicleClassId);
       console.log('📈 Vehicles Monthly series (for LineChart data=…):', monthly);
    console.log('📈 Vehicles Yearly series (for LineChart data=…):', yearly);

    } catch (err) {
      console.error('Vehicle fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  /**
   * Build monthly counts for ALL 12 months of the CURRENT YEAR and for ALL classes from getTypes.
   * Months with no trips are zero-padded so the x-axis is stable (Jan..Dec).
   */
  const barsToRender = useMemo(() => {
    if (!typesData.length) return [];

    const months = [...MONTHS]; // Jan..Dec
    const classOrder: string[] = typesData.map((t: any) => t.ItemName);
    const colorsByClass: Record<string, string> = Object.fromEntries(
      classOrder.map(c => [c, getClassColor(c)])
    );

    // 1) init month -> class -> count
    const counts: Record<string, Record<string, number>> = {};
    months.forEach(m => (counts[m] = {}));

    // 2) fill counts
    tripsData.forEach(t => {
      const m = dayjs(t.TransactionDate).format('MMM');
      const lpn = lpnData.find(v => v.AssetIdentifier === t.VRM);
      const classId = lpn?.OverallClassId;
      const className = typesData.find((x: any) => x.ItemId === classId)?.ItemName ?? 'Others';
      if (!counts[m]) counts[m] = {};
      counts[m][className] = (counts[m][className] ?? 0) + 1;
    });

    // 3) keep only months that have any data
    const monthsWithData = months.filter(m =>
      Object.values(counts[m] ?? {}).some(v => (v || 0) > 0)
    );
    if (!monthsWithData.length) return [];

    // 4) build flat bars: only non-zero classes; fixed gap within month vs after month
    const INTRA_SPACING = 8;   // gap between bars inside the same month
    const GROUP_SPACING = 28;  // gap after the last bar of a month

    const flatBars: any[] = [];
    monthsWithData.forEach(m => {
      const activeClasses = classOrder.filter(cls => (counts[m]?.[cls] ?? 0) > 0);
      if (activeClasses.length === 0) return;

      activeClasses.forEach((cls, idx) => {
        const val = counts[m][cls] ?? 0;
        const isFirst = idx === 0;
        const isLast = idx === activeClasses.length - 1;

        flatBars.push({
          value: val,
          label: isFirst ? m : undefined,                       // month label once
          spacing: isLast ? GROUP_SPACING : INTRA_SPACING,      // consistent month gap
          labelWidth: isFirst ? 30 : undefined,
          labelTextStyle: isFirst ? { color: 'gray' } : undefined,
          frontColor: colorsByClass[cls],
          topLabelComponent: () => (
            <Text style={{ fontSize: 10, color: '#333', fontWeight: '600' }}>
              {val}
            </Text>
          ),
        });
      });
    });

    return flatBars;
  }, [tripsData, lpnData, typesData]);

  /** Yearly view: last 5 calendar years including current (e.g., 2021–2025) */
  const barsToRenderYearly = useMemo(() => {
    if (!typesData.length) return [];

    const currentYear = dayjs().year();
    const years: number[] = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i); // [Y-4..Y]
    const classOrder: string[] = typesData.map((t: any) => t.ItemName);
    const colorsByClass: Record<string, string> = Object.fromEntries(
      classOrder.map(c => [c, getClassColor(c)])
    );

    // init year -> class -> count
    const counts: Record<number, Record<string, number>> = {};
    years.forEach(y => (counts[y] = {}));

    // aggregate
    tripsData.forEach(t => {
      const y = Number(dayjs(t.TransactionDate).format('YYYY'));
      if (!years.includes(y)) return; // only last 5 years window
      const lpn = lpnData.find(v => v.AssetIdentifier === t.VRM);
      const classId = lpn?.OverallClassId;
      const className = typesData.find((x: any) => x.ItemId === classId)?.ItemName ?? 'Others';
      if (!counts[y]) counts[y] = {};
      counts[y][className] = (counts[y][className] ?? 0) + 1;
    });

    // ALWAYS show all 5 years on x-axis (even if zero)
    const INTRA_SPACING = 8;
    const GROUP_SPACING = 28;

    const flatBars: any[] = [];
    years.forEach(y => {
      // classes with data this year
      const activeClasses = classOrder.filter(cls => (counts[y]?.[cls] ?? 0) > 0);

      // If no data for the year at all, still emit a zero bar to keep the label visible
      if (activeClasses.length === 0) {
        flatBars.push({
          value: 0,
          label: String(y),
          spacing: GROUP_SPACING,
          labelWidth: 34,
          labelTextStyle: { color: 'gray' },
          frontColor: '#ccc',
          topLabelComponent: () => null,
        });
        return;
      }

      activeClasses.forEach((cls, idx) => {
        const val = counts[y][cls] ?? 0;
        const isFirst = idx === 0;
        const isLast = idx === activeClasses.length - 1;

        flatBars.push({
          value: val,
          label: isFirst ? String(y) : undefined,
          spacing: isLast ? GROUP_SPACING : INTRA_SPACING,
          labelWidth: isFirst ? 34 : undefined,
          labelTextStyle: isFirst ? { color: 'gray' } : undefined,
          frontColor: colorsByClass[cls],
          topLabelComponent: () => (
            <Text style={{ fontSize: 10, color: '#333', fontWeight: '600' }}>{val}</Text>
          ),
        });
      });
    });

    return flatBars;
  }, [tripsData, lpnData, typesData]);

  /** Auto y-axis max for nicer grid */
  const selectedBars = viewMode === 'monthly' ? barsToRender : barsToRenderYearly;
  const maxValue = useMemo(() => {
    const max = Math.max(1, ...selectedBars.map(b => Number(b.value) || 0));
    const padded = Math.ceil(max * 1.15);                    // 15% headroom
    const step = padded <= 50 ? 5 : padded <= 100 ? 10 : 20; // nice ticks
    return Math.ceil(padded / step) * step;
  }, [selectedBars]);

  const vehiclesLineDataMonthly = useMemo(() => {
    if (!vehiclesData?.length) return [];

    // group by YYYY-MM across all years
    const buckets = new Map<string, number>();

    vehiclesData.forEach((v: any) => {
      const d = dayjs(v.ValidFromDate);
      if (!d.isValid()) return;
      if (vehicleClassId !== 'all' && v.OverallClassId !== vehicleClassId) return;

      const key = d.format('YYYY-MM'); // stable sort key
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    });

    const orderedKeys = Array.from(buckets.keys()).sort(); // chronological
    return orderedKeys.map(k => {
      const count = buckets.get(k) ?? 0;
      const label = dayjs(k + '-01').format('MMM'); // e.g., "Jan 21"
      return {
        value: count,
        label,               // x-axis label
        dataPointText: String(count), // number above point
      };
    });
  }, [vehiclesData, vehicleClassId]);

  const vehiclesLineDataYearly = useMemo(() => {
    if (!vehiclesData?.length) return [];
    const byYear = new Map<number, number>();

    vehiclesData.forEach((v: any) => {
      const d = dayjs(v.ValidFromDate);
      if (!d.isValid()) return;
      if (vehicleClassId !== 'all' && v.OverallClassId !== vehicleClassId) return;

      const y = d.year();
      byYear.set(y, (byYear.get(y) ?? 0) + 1);
    });

    const years = Array.from(byYear.keys()).sort((a, b) => a - b);
    return years.map(y => ({
      value: byYear.get(y) ?? 0,
      label: String(y),
      dataPointText: String(byYear.get(y) ?? 0),
    }));
  }, [vehiclesData, vehicleClassId]);


  const vehicleLineData = viewMode === 'monthly'
    ? vehiclesLineDataMonthly
    : vehiclesLineDataYearly;

  const vehicleMaxValue = useMemo(() => {
    const max = Math.max(1, ...vehicleLineData.map(p => Number(p.value) || 0));
    // light headroom for line chart
    const padded = Math.ceil(max * 1.15);
    const step = padded <= 50 ? 5 : padded <= 100 ? 10 : 20;
    return Math.ceil(padded / step) * step;
  }, [vehicleLineData]);
  console.log("vehiceldata", vehicleLineData);
  

const buildVehiclesMonthlySeries = (
  vehicles: any[],
  classFilter: number | 'all'
) => {
  // group by YYYY-MM across all years
  const buckets = new Map<string, number>();

  vehicles.forEach(v => {
    if (classFilter !== 'all' && v.OverallClassId !== classFilter) return;
    const d = dayjs(v.ValidFromDate);
    if (!d.isValid()) return;
    const key = d.format('YYYY-MM'); // stable sort key
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  });

  const orderedKeys = Array.from(buckets.keys()).sort(); // chronological
  return orderedKeys.map(k => {
    const count = buckets.get(k) ?? 0;
    const label = dayjs(k + '-01').format('MMM YY'); // e.g., "Jan 21"
    return {
      value: count,
      label,
      dataPointText: String(count),
    };
  });
};

const buildVehiclesYearlySeries = (
  vehicles: any[],
  classFilter: number | 'all'
) => {
  const byYear = new Map<number, number>();

  vehicles.forEach(v => {
    if (classFilter !== 'all' && v.OverallClassId !== classFilter) return;
    const d = dayjs(v.ValidFromDate);
    if (!d.isValid()) return;
    const y = d.year();
    byYear.set(y, (byYear.get(y) ?? 0) + 1);
  });

  const years = Array.from(byYear.keys()).sort((a, b) => a - b);
  return years.map(y => ({
    value: byYear.get(y) ?? 0,
    label: String(y),
    dataPointText: String(byYear.get(y) ?? 0),
  }));
};


// Months that appear in ANY class (e.g., Jan, Jul) — not fixed Jan..Dec.
// To switch to fixed Jan..Dec, set monthsWithAnyDataIdx = [0..11].
const vehicleSeriesByClass = useMemo(() => {
  if (!vehiclesData?.length || !vehicleLegendItems.length) return [];

  // Count per class x monthIndex (0..11)
  const countsByClass = new Map<number, number[]>();
  vehicleLegendItems.forEach(li => countsByClass.set(li.classId, Array(12).fill(0)));

  vehiclesData.forEach((v: any) => {
    const d = dayjs(v.ValidFromDate);
    if (!d.isValid()) return;
    const cid = v.OverallClassId ?? 0;
    if (!countsByClass.has(cid)) countsByClass.set(cid, Array(12).fill(0));
    countsByClass.get(cid)![d.month()] += 1;
  });

  // Determine which months have any data across all classes
  const monthTotals = Array(12).fill(0);
  countsByClass.forEach(arr => arr.forEach((val, m) => (monthTotals[m] += val)));
  const monthsWithAnyDataIdx = monthTotals
    .map((val, idx) => (val > 0 ? idx : -1))
    .filter(idx => idx >= 0);

  // Build series (aligned labels & order = legend order)
  return vehicleLegendItems.map(li => {
    const arr = countsByClass.get(li.classId) || Array(12).fill(0);
    const data = monthsWithAnyDataIdx.map(mIdx => ({
      value: arr[mIdx] ?? 0,
      label: MONTHS[mIdx],               // 'Jan', 'Jul', ...
      dataPointText: String(arr[mIdx] ?? 0),
    }));
    return { classId: li.classId, label: li.label, color: li.color, data };
  });
}, [vehiclesData, vehicleLegendItems]);

const chunk = (arr:any[], size:number) => arr.reduce((acc,_,i)=> (i%size? acc : [...acc, arr.slice(i,i+size)]), [] as any[]);

const vehicleSeriesChunks = useMemo(() => chunk(vehicleSeriesByClass, 5), [vehicleSeriesByClass]);

  console.log("selectedBars", selectedBars);
  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.backgroundImage}
      resizeMode="cover">
      <PaperProvider>
        <View style={styles.headerMain}>
          <View style={styles.headerLeftBlock}>
            <TouchableOpacity style={[styles.backBt, { marginRight: 12 }]} onPress={() => navigation.goBack()}>
              <Image style={styles.headerIcon} source={require('../../assets/images/left-arrow.png')} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Dashboard</Text>
          </View>
        </View>

        <ScrollView>
          <View style={styles.containerInner}>
            <Text style={styles.PageTitle}>Most Recent Metrics</Text>
            <Image style={[styles.roundedIcon, { marginLeft: 0 }]} source={require('../../assets/images/trips-icon.png')} />
    <View style={{ marginBottom: 8 }}>
                  <SegmentedButtons
                    value={viewMode}
                    onValueChange={(v) => setViewMode(v as 'monthly' | 'yearly')}
                    buttons={[
                      { value: 'monthly', label: 'Monthly' },
                      { value: 'yearly', label: 'Yearly' },
                    ]}
                    density="regular"
                  />
                </View>
            <Card style={styles.cardItemMain}>
              <View style={{ paddingVertical: 20, paddingHorizontal: 10 }}>
                {/* VIEW MODE SWITCH */}
                
                <View style={styles.chartWrapper}>
                  {/* BAR CHART */}
                  <BarChart
                    data={
                      selectedBars.length
                        ? selectedBars
                        : [
                          {
                            value: 0,
                            label: viewMode === 'monthly' ? 'Jan' : String(dayjs().year() - 4),
                            spacing: 2,
                            labelWidth: 30,
                            labelTextStyle: { color: 'gray' },
                            frontColor: '#ccc',
                          },
                          { value: 0, frontColor: '#ccc' },
                        ]
                    }
                    barWidth={12}
                    // spacing={24}
                    roundedTop
                    roundedBottom
                    hideRules
                    xAxisThickness={0}
                    yAxisThickness={0}
                    yAxisTextStyle={{ color: 'gray' }}
                    noOfSections={5}
                    maxValue={maxValue}
                  />
                  {loading && (
                    <View style={styles.loadingOverlay}>
                      <ActivityIndicator animating={true} />
                      <Text style={{ marginTop: 8, color: '#333' }}>Loading…</Text>
                    </View>
                  )}
                </View>


                {/* LEGEND (below the bar chart) – shows ALL classes from getTypes */}
                <View style={styles.legendContainer}>
                  {legendItems.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                      <View style={[styles.dot, { backgroundColor: item.color }]} />
                      <Text style={styles.legendLabel}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Card>

            {/* VEHICLES */}
            <Card style={styles.cardItemMain}>
              <View style={{ paddingVertical: 20, paddingHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 }}>
                  <Image style={[styles.roundedIcon, { marginLeft: 0 }]} source={require('../../assets/images/vehicles-icon.png')} />
                  <Text style={[styles.PageTitle, { marginBottom: 0 }]}>Vehicles Added (by {viewMode === 'monthly' ? 'Month' : 'Year'})</Text>
                </View>

 <View style={styles.chartWrapper}>
  {vehicleSeriesChunks.map((grp, gi) => {
    const s = grp; // s[0]..s[4]
    return (
      <LineChart
        key={gi}
        data={s[0]?.data}
        data2={s[1]?.data}
        data3={s[2]?.data}
        data4={s[3]?.data}
        data5={s[4]?.data}
        color={s[0]?.color}
        color2={s[1]?.color}
        color3={s[2]?.color}
        color4={s[3]?.color}
        color5={s[4]?.color}
        curved
        thickness={2}
        noOfSections={5}
        maxValue={Math.max(5, ...vehicleSeriesByClass.flatMap(x => x.data.map(p => p.value)))}
        showDataPoint
        yAxisColor="#ccc"
        yAxisTextStyle={{ color: '#888' }}
        xAxisColor="#ccc"
        xAxisLabelTextStyle={{ color: '#000', fontWeight: '600' }}
        areaChart={false}      // cleaner for multi-line
        // Make stacked charts overlay perfectly:
        hideRules={gi > 0}
        yAxisThickness={gi > 0 ? 0 : 1}
        xAxisThickness={gi > 0 ? 0 : 1}
        initialSpacing={gi > 0 ? 0 : undefined}
      />
    );
  })}

  {loading && (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator animating />
      <Text style={{ marginTop: 8, color: '#333' }}>Loading…</Text>
    </View>
  )}
</View>

                {/* Optional: quick legend/filter by class */}
                {/* Example: show class dots only; wire a selector later if needed */}
                <View style={[styles.legendContainer, { marginTop: 10 }]}>
                  {legendItems.map((item, idx) => (
                    <View key={idx} style={styles.legendItem}>
                      <View style={[styles.dot, { backgroundColor: item.color }]} />
                      <Text style={styles.legendLabel}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Card>

          </View>
        </ScrollView>
      </PaperProvider>
    </ImageBackground>
  );
};

export default DashboardPage;

const styles = StyleSheet.create({
  cardItemMain: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 0,
    marginHorizontal: 5,
    marginBottom: 12,
    backgroundColor: '#fff',
    shadowOpacity: 0,
    elevation: 0,
    width: '100%',
  },

  /* Legend below the chart */
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendLabel: { fontSize: 12, color: '#333' },

  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  containerInner: { marginHorizontal: 25, marginTop: 15 },

  headerMain: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 15, paddingVertical: 6, backgroundColor: 'transparent', marginTop: 12,
  },
  backBt: {},
  headerLeftBlock: { flexDirection: 'row', justifyContent: 'flex-start' },
  headerIcon: { width: 18, height: 18 },
  headerTitle: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
  PageTitle: { fontSize: 15, fontWeight: 'bold', color: '#fff', marginBottom: 10, paddingLeft: 8, marginTop: 10 },
  chartWrapper: {
    position: 'relative',
    minHeight: 220, // ensures overlay area is tappable/visible; adjust to your chart height
    justifyContent: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundedIconBt: {
    width: 34,
    height: 34,
    backgroundColor: '#ff5200',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    paddingHorizontal: 0,
  },
  roundedIcon: {
    width: 22,
    height: 22,
  },

});
