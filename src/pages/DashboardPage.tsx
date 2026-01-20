import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../App';
import { StyleSheet, View, TouchableOpacity, ScrollView, ImageBackground, Image } from 'react-native';
import { ActivityIndicator, Card, PaperProvider, SegmentedButtons, Text } from 'react-native-paper';
import dayjs from 'dayjs';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import { getLicenceNumber, getTodaysTrips, getOverallClasses, getVehiclesList } from '../services/common';
import { useAccount } from '../context/AccountProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Trip {
  AssetId: string;
  VRM: string;
  LocationName: string;
  TransactionId: string;
  TransactionDate: string;
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
  OverallClassId: number; // 0 => Unknown
  ValidFromDate: string;   // ISO
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

  const [lpnValue, setLpnValue] = useState<any>(0);
  const [tripsData, setTripsData] = useState<Trip[]>([]);
  const [vehiclesData, setVehiclesData] = useState<VehicleItem[]>([]);
  const [accountDetails, setAccountDetails] = useState<any>();
  const [lpnData, setLpnData] = useState<LPN[]>([]);
  const [typesData, setTypesData] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [seriesPage, setSeriesPage] = useState(0);

  // ==== Legends ====
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
    const hasUnknown = (vehiclesData || []).some(v => (v.OverallClassId ?? 0) === 0);
    return hasUnknown
      ? [{ classId: 0, label: 'Unknown', color: getClassColor('Unknown') }, ...base]
      : base;
  }, [typesData, vehiclesData]);

  useEffect(() => setAccountDetails(full), [full]);

  useEffect(() => {
    if (!accountDetails) return;
    const load = async () => {
      try {
        setLoading(true);
        const [typesRes, lpnRes] = await Promise.all([
          getOverallClasses(),
          getLicenceNumber({ accountId: accountDetails.AccountId, assetTypeId: 2 }),
        ]);
        setTypesData(typesRes || []);

        const lpnFormatted = (lpnRes || []).map((item: any) => ({
          ...item,
          label: item.AssetIdentifier,
          value: item.AccountUnitId,
        }));
        setLpnData(lpnFormatted);

        await Promise.all([getTrips(), getVehicles()]);
      } catch (e) {
        console.error('Init load failed:', e);
      } finally {
        setLoading(false);
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
        fromDate: `${dayjs().subtract(5, 'year').year()}-01-01`,
        toDate: toDatetime,
        PageNumber: 1,
        PageSize: 1000,
      };
      const response = await getTodaysTrips(payload);
      const trips = response?.TransactionsList || [];
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
      // Accept either { List: [...] } or [...]
      const list: VehicleItem[] = Array.isArray(res?.List) ? res.List : (Array.isArray(res) ? res : []);
      setVehiclesData(list);
    } catch (err) {
      console.error('Vehicle fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ===== TRIPS: Monthly (existing logic) =====
  const barsToRender = useMemo(() => {
    if (!typesData.length) return [];

    const months = [...MONTHS];
    const classOrder: string[] = typesData.map((t: any) => t.ItemName);
    const colorsByClass: Record<string, string> =
      Object.fromEntries(classOrder.map(c => [c, getClassColor(c)]));

    const counts: Record<string, Record<string, number>> = {};
    months.forEach(m => (counts[m] = {}));

    tripsData.forEach(t => {
      const m = dayjs(t.TransactionDate).format('MMM');
      const lpn = lpnData.find(v => v.AssetIdentifier === t.VRM);
      const classId = lpn?.OverallClassId;
      const className = typesData.find((x: any) => x.ItemId === classId)?.ItemName ?? 'Others';
      if (!counts[m]) counts[m] = {};
      counts[m][className] = (counts[m][className] ?? 0) + 1;
    });

    const monthsWithData = months.filter(m =>
      Object.values(counts[m] ?? {}).some(v => (v || 0) > 0)
    );
    if (!monthsWithData.length) return [];

    const INTRA_SPACING = 8;
    const GROUP_SPACING = 28;

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
          label: isFirst ? m : undefined,
          spacing: isLast ? GROUP_SPACING : INTRA_SPACING,
          labelWidth: isFirst ? 30 : undefined,
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

  // ===== TRIPS: Yearly (last 5 years) =====
  const barsToRenderYearly = useMemo(() => {
    if (!typesData.length) return [];

    const currentYear = dayjs().year();
    const years: number[] = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);
    // const years: number[] = [2021, 2022, 2023, 2024, 2025];
    const classOrder: string[] = typesData.map((t: any) => t.ItemName);
    const colorsByClass: Record<string, string> =
      Object.fromEntries(classOrder.map(c => [c, getClassColor(c)]));

    const counts: Record<number, Record<string, number>> = {};
    years.forEach(y => (counts[y] = {}));

    tripsData.forEach(t => {
      const y = Number(dayjs(t.TransactionDate).format('YYYY'));
      if (!years.includes(y)) return;
      const lpn = lpnData.find(v => v.AssetIdentifier === t.VRM);
      const classId = lpn?.OverallClassId;
      const className = typesData.find((x: any) => x.ItemId === classId)?.ItemName ?? 'Others';
      if (!counts[y]) counts[y] = {};
      counts[y][className] = (counts[y][className] ?? 0) + 1;
    });

    const INTRA_SPACING = 8;
    const GROUP_SPACING = 28;

    const flatBars: any[] = [];
    years.forEach(y => {
      const active = classOrder.filter(cls => (counts[y]?.[cls] ?? 0) > 0);
      if (!active.length) {
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
      active.forEach((cls, idx) => {
        const val = counts[y][cls] ?? 0;
        const isFirst = idx === 0;
        const isLast = idx === active.length - 1;

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

  // ===== Bind Trips to single switch =====
  const selectedBars = viewMode === 'monthly' ? barsToRender : barsToRenderYearly;
  const tripsMaxValue = useMemo(() => {
    const max = Math.max(1, ...selectedBars.map(b => Number(b.value) || 0));
    const padded = Math.ceil(max * 1.15);
    const step = padded <= 50 ? 5 : padded <= 100 ? 10 : 20;
    return Math.ceil(padded / step) * step;
  }, [selectedBars]);

  // ========= VEHICLES (ONE LINE PER CLASS) =========

  // Monthly per class (sparse months only)
  const vehicleSeriesMonthlyByClass = useMemo(() => {
    if (!vehiclesData?.length || !vehicleLegendItems.length) return [];

    // classId -> [12] month counts
    const countsByClass = new Map<number, number[]>();
    vehicleLegendItems.forEach(li => countsByClass.set(li.classId, Array(12).fill(0)));

    vehiclesData.forEach(v => {
      const d = dayjs(v.ValidFromDate);
      if (!d.isValid()) return;
      const cid = (v.OverallClassId ?? 0);
      if (!countsByClass.has(cid)) countsByClass.set(cid, Array(12).fill(0));
      countsByClass.get(cid)![d.month()] += 1;
    });

    // Which months have ANY data across classes
    const monthTotals = Array(12).fill(0);
    countsByClass.forEach(arr => arr.forEach((val, m) => (monthTotals[m] += val)));
    const monthsWithData = monthTotals.map((v, i) => (v > 0 ? i : -1)).filter(i => i >= 0);

    const series = vehicleLegendItems.map(li => {
      const arr = countsByClass.get(li.classId) || Array(12).fill(0);
      const data = monthsWithData.map(mIdx => ({
        value: arr[mIdx] ?? 0,
        label: MONTHS[mIdx],
        dataPointText: String(arr[mIdx] ?? 0),
      }));
      return { classId: li.classId, label: li.label, color: li.color, data };
    });

    console.log('🚗 Vehicles Monthly (per class series):', series);
    return series;
  }, [vehiclesData, vehicleLegendItems]);

  // Yearly per class (all years found in data)
  const vehicleSeriesYearlyByClass = useMemo(() => {
    if (!vehiclesData?.length || !vehicleLegendItems.length) return [];

    // Build year set
    const yearsSet = new Set<number>();
    vehiclesData.forEach(v => {
      const d = dayjs(v.ValidFromDate);
      if (d.isValid()) yearsSet.add(d.year());
    });
    const currentYear = dayjs().year();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);

    // classId -> (year -> count)
    const counts = new Map<number, Map<number, number>>();
    vehicleLegendItems.forEach(li => counts.set(li.classId, new Map()));

    vehiclesData.forEach(v => {
      const d = dayjs(v.ValidFromDate);
      if (!d.isValid()) return;
      const y = d.year();
      const cid = (v.OverallClassId ?? 0);
      if (!counts.has(cid)) counts.set(cid, new Map());
      const m = counts.get(cid)!;
      m.set(y, (m.get(y) ?? 0) + 1);
    });

    const series = vehicleLegendItems.map(li => {
      const m = counts.get(li.classId) || new Map<number, number>();
      const data = years.map(y => ({
        value: m.get(y) ?? 0,
        label: String(y),
        dataPointText: String(m.get(y) ?? 0),
      }));
      return { classId: li.classId, label: li.label, color: li.color, data };
    });

    console.log('🚗 Vehicles Yearly (per class series):', series);
    return series;
  }, [vehiclesData, vehicleLegendItems]);

  // Bind Vehicles to the SAME single switch
  const vehicleSeriesByClass = viewMode === 'monthly'
    ? vehicleSeriesMonthlyByClass
    : vehicleSeriesYearlyByClass;

  // Split into chunks of 5 lines per chart (gifted-charts supports data..data5)
  const chunk = <T,>(arr: T[], size: number) =>
    arr.reduce<T[][]>((acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);

  const vehicleSeriesChunks = useMemo(() => chunk(vehicleSeriesByClass, 5), [vehicleSeriesByClass]);
  const pageSeries = vehicleSeriesChunks[seriesPage] || [];
  const s = pageSeries
  // Axis max for vehicles
  const vehiclesMaxValue = useMemo(
    () => Math.max(5, ...vehicleSeriesByClass.flatMap(s => s.data.map(p => p.value))),
    [vehicleSeriesByClass]
  );

  // Debug logs for what’s sent to charts
  useEffect(() => {
    console.log('📊 Trips bars -> BarChart:', selectedBars);
  }, [selectedBars]);
  useEffect(() => {
    console.log(`📈 Vehicles (${viewMode}) series -> LineChart:`, vehicleSeriesByClass);
  }, [vehicleSeriesByClass, viewMode]);

  /** All-vehicles monthly series (Jan..Dec across all years, zeros padded) */
  const vehiclesAllMonthly = useMemo(() => {
    if (!vehiclesData?.length) return [];

    // 12 buckets for Jan..Dec
    const byMonth = Array(12).fill(0);

    vehiclesData.forEach(v => {
      const d = dayjs(v.ValidFromDate);
      if (!d.isValid()) return;
      byMonth[d.month()] += 1;               // month(): 0..11
    });

    // Build Jan..Dec, always 12 labels
    return MONTHS.map((m, idx) => ({
      value: byMonth[idx],
      label: m,
      dataPointText: String(byMonth[idx]),
    }));
  }, [vehiclesData]);

  /** All-vehicles yearly series (each year found in data, ascending) */
  const vehiclesAllYearly = useMemo(() => {
    if (!vehiclesData?.length) return [];

    const map = new Map<number, number>();
    vehiclesData.forEach(v => {
      const d = dayjs(v.ValidFromDate);
      if (!d.isValid()) return;
      const y = d.year();
      map.set(y, (map.get(y) ?? 0) + 1);
    });

    const years = Array.from(map.keys()).sort((a, b) => a - b);
    return years.map(y => ({
      value: map.get(y) ?? 0,
      label: String(y),
      dataPointText: String(map.get(y) ?? 0),
    }));
  }, [vehiclesData]);

  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.backgroundImage}
      resizeMode="cover">
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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
            <View style={styles.flexBox}>
              <Text style={styles.PageTitle}>Most Recent Metrics  </Text><Image style={[styles.roundedIcon, ]} source={require('../../assets/images/trips-icon.png')} />
            </View>

            {/* ===== Single switch for BOTH charts ===== */}
            <View style={{ marginBottom: 8 }}>
              <SegmentedButtons
                value={viewMode}
                onValueChange={(v) => setViewMode(v as 'monthly' | 'yearly')}
                buttons={[
                  {
                    value: 'monthly',
                    label: 'Monthly',
                    style: {
                      backgroundColor: viewMode === 'monthly' ? '#ff5200' : '#fff', // Active: darker blue
                    },
                    labelStyle: {
                      color: viewMode === 'monthly' ? '#fff' : '#000', // Active: white text
                    },
                  },
                  {
                    value: 'yearly',
                    label: 'Yearly',
                    style: {
                      backgroundColor: viewMode === 'yearly' ? '#ff5200' : '#fff', // Active: darker green
                    },
                    labelStyle: {
                      color: viewMode === 'yearly' ? '#fff' : '#000', // Active: white text
                    },
                  },
                ]}
                density="regular"
              />

            </View>

            {/* ===== Trips ===== */}
           
            <Card style={styles.cardItemMain}>
              <View style={{ paddingVertical: 20, paddingHorizontal: 10 }}>
                <View style={styles.chartWrapper}>
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
                    roundedTop
                    roundedBottom
                    hideRules
                    xAxisThickness={0}
                    yAxisThickness={0}
                    yAxisTextStyle={{ color: 'gray' }}
                    noOfSections={5}
                    maxValue={tripsMaxValue}
                  />
                  {loading && (
                    <View style={styles.loadingOverlay}>
                      <ActivityIndicator animating={true} />
                      <Text style={{ marginTop: 8, color: '#333' }}>Loading…</Text>
                    </View>
                  )}
                </View>

                {/* Legend from getTypes */}
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

            {/* ===== Vehicles ===== */}
            <Card style={styles.cardItemMain}>
              <View style={{ paddingVertical: 20, paddingHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 }}>
                  {/* <Image style={[styles.roundedIcon, { marginLeft: 0 }]} source={require('../../assets/images/vehicles-icon.png')} /> */}
                  {/* <Text style={[styles.PageTitle, { marginBottom: 0 }]}>
                    Vehicles Added (by {viewMode === 'monthly' ? 'Month' : 'Year'})
                  </Text> */}
                </View>

                <View style={styles.chartWrapper}>
                  <LineChart
                    data={pageSeries[0]?.data}
                    data2={pageSeries[1]?.data}
                    data3={pageSeries[2]?.data}
                    data4={pageSeries[3]?.data}
                    data5={pageSeries[4]?.data}
                    color={pageSeries[0]?.color}
                    color2={pageSeries[1]?.color}
                    color3={pageSeries[2]?.color}
                    color4={pageSeries[3]?.color}
                    color5={pageSeries[4]?.color}
                    curved
                    thickness={2}
                    noOfSections={5}
                    height={220}
                    maxValue={vehiclesMaxValue}
                    showDataPoint
                    yAxisColor="#ccc"
                    yAxisTextStyle={{ color: '#888' }}
                    xAxisColor="#ccc"
                    xAxisLabelTextStyle={{ color: '#000', fontWeight: '600' }}
                    areaChart={false}
                  />
                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                    <TouchableOpacity
                      onPress={() => setSeriesPage((prev) => Math.max(prev - 1, 0))}
                      disabled={seriesPage === 0}
                      style={{ marginHorizontal: 10, opacity: seriesPage === 0 ? 0.4 : 1 }}
                    >
                      <Text>⬅ Prev</Text>
                    </TouchableOpacity>

                    <Text>Page {seriesPage + 1} of {vehicleSeriesChunks.length}</Text>

                    <TouchableOpacity
                      onPress={() => setSeriesPage((prev) => Math.min(prev + 1, vehicleSeriesChunks.length - 1))}
                      disabled={seriesPage >= vehicleSeriesChunks.length - 1}
                      style={{ marginHorizontal: 10, opacity: seriesPage >= vehicleSeriesChunks.length - 1 ? 0.4 : 1 }}
                    >
                      <Text>Next ➡</Text>
                    </TouchableOpacity>
                  </View>


                  {loading && (
                    <View style={styles.loadingOverlay}>
                      <ActivityIndicator animating />
                      <Text style={{ marginTop: 8, color: '#333' }}>Loading…</Text>
                    </View>
                  )}
                </View>

                {/* Vehicles legend (includes Unknown if present) */}
                <View style={styles.legendContainer}>
                  {vehicleLegendItems.map((item, idx) => (
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
      </SafeAreaView>
    </ImageBackground>
  );
};

export default DashboardPage;

// NOTE: styles assumed present elsewhere in your file/module



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
  safeArea: { flex: 1 },
  containerInner: { marginHorizontal: 25, marginTop: 15 },

  headerMain: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 15, paddingVertical: 6, backgroundColor: 'transparent',
  },
  backBt: {},
  flexBox:{flexDirection: 'row'},
  headerLeftBlock: { flexDirection: 'row', justifyContent: 'flex-start' },
  headerIcon: { width: 18, height: 18 },
  headerTitle: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
  PageTitle: { fontSize: 15, fontWeight: 'bold', color: '#fff', marginBottom: 10, paddingLeft: 8, marginTop: 5 },
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
