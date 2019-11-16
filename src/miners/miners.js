import HealthData from '../data/health.json';

const binnedByDay = (data) => data.reduce(
  (bins, point) => {
    const [ date ] = point["startDate"].split(" ");

    if (bins[date] === undefined) {
      bins[date] = [];
    }

    const { [date]: bin } = bins;

    bin.push(point);

    return bins;
  },
  {},
);

const withLazy = (fn, cache={}) => (...args) => (
  key => cache[key] === undefined
    ? cache[key] = fn(...args)
    : cache[key]
)(JSON.stringify(args));

const transformExports = (exports) => (data) => exports
  .reduce(
    (acc, { maker, ...rest }) => [
      ...acc,
      {
        maker: withLazy(maker(data)),
        ...rest,
      },
    ],
    [],
  );

const reduceValue = (key, parser = parseFloat) => ({ [key]: data }) => () => data
  .reduce(
    (acc, { startDate, value }) => ({
      ...acc,
      [startDate]: parser(value, 10),
    }),
    {},
  );

/**
 * Sleep Analysis
 */

const sleepDuration = ({ startDate, endDate }) => (
  (new Date(endDate)) - (new Date(startDate))
) / 36e5;

const sleepHoursPerDay = ({ SleepAnalysis }) => () => Object.entries(
  binnedByDay(SleepAnalysis)
).reduce(
  (acc, [date, sleeps]) => ({
    ...acc,
    [date]: sleeps.reduce(
      (sum, sleep) => sleep.value === "HKCategoryValueSleepAnalysisInBed"
        ? sum + sleepDuration(sleep)
        : sum,
      0,
    ),
  }),
  {},
);

/**
 * Export structure
 */

const Hours = { units: 'Hours', shortUnits: 'H' };
const Milliliters = { units: 'Milliliters', shortUnits: 'ml' };
const Milliseconds = { units: 'Milliseconds', shortUnits: 'ms' };
const Grams = { units: 'Grams', shortUnits: 'g' };
const Milligrams = { units: 'Milligrams', shortUnits: 'mg' };
const mmHG = { units: 'mm Mercury', shortUnits: 'mmHG' };
const BPM = { units: 'Beats Per Minute', shortUnits: 'bpm' };

export default transformExports([
  {
    title: 'Sleep Hours Per Day',
    maker: sleepHoursPerDay,
    ...Hours,
  },{
    title: 'Caffeine Intake',
    maker: reduceValue('DietaryCaffeine'),
    ...Milliliters,
  },{
    title: 'Heart Rate Variability',
    maker: reduceValue('HeartRateVariabilitySDNN'),
    ...Milliseconds,
  },{
    title: 'Protein Intake',
    maker: reduceValue('DietaryProtein'),
    ...Grams,
  },{
    title: 'Calcium Intake',
    maker: reduceValue('DietaryCalcium'),
    ...Milligrams,
  },{
    title: 'Cholesterol Intake',
    maker: reduceValue('DietaryCholesterol'),
    ...Milligrams,
  },{
    title: 'Total Fat Intake',
    maker: reduceValue('DietaryFatTotal'),
    ...Grams,
  },{
    title: 'Saturated Fat Intake',
    maker: reduceValue('DietaryFatSaturated'),
    ...Grams,
  },{
    title: 'Polyunsaturated Fat Intake',
    maker: reduceValue('DietaryFatPolyunsaturated'),
    ...Grams,
  },{
    title: 'Monounsaturated Fat Intake',
    maker: reduceValue('DietaryFatMonounsaturated'),
    ...Grams,
  },{
    title: 'Sugar Intake',
    maker: reduceValue('DietarySugar'),
    ...Grams,
  },{
    title: 'Carbohydrate Intake',
    maker: reduceValue('DietaryCarbohydrates'),
    ...Grams,
  },{
    title: 'Sodium Intake',
    maker: reduceValue('DietarySodium'),
    ...Milligrams,
  },{
    title: 'Diastolic Blood Pressure',
    maker: reduceValue('BloodPressureDiastolic'),
    ...mmHG,
  },{
    title: 'Systolic Blood Pressure',
    maker: reduceValue('BloodPressureSystolic'),
    ...mmHG,
  },{
    title: 'Heart Rate',
    maker: reduceValue('WalkingHeartRateAverage'),
    ...BPM,
  },{
    title: 'Resting Heart Rate',
    maker: reduceValue('RestingHeartRate'),
    ...BPM,
  }
])(HealthData);
