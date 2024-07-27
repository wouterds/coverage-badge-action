import fs from 'fs';
import { makeBadge } from 'badge-maker';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const args = yargs(hideBin(process.argv)).argv;
const label = args.label || 'coverage';
const coverage = parseInt(args.coverage);
const style = args.style || 'github';

if (!label || !style || !coverage) {
  console.error('Missing required arguments');
  process.exit(1);
}

if (isNaN(coverage)) {
  console.error('Coverage must be a number');
  process.exit(1);
}

if (!['github', 'classic'].includes(style)) {
  console.error('Invalid style');
  process.exit(1);
}

let color = 'red';
if (coverage >= 90) {
  color = 'brightgreen'
} else if (coverage >= 80) {
  color = 'green'
} else if (coverage >= 70) {
  color = 'yellow'
} else if (coverage >= 60) {
  color = 'orange'
}

let labelColor = 'grey';
if (style === 'github') {
  color = '#FF4D4D';
  labelColor = '#353B43';

  if (coverage >= 80) {
    color = '#30BD50'
  } else if (coverage >= 60) {
    color = '#FFD166'
  }
}

const svg = makeBadge({
  label,
  message: coverage + '%',
  labelColor,
  color,
  logoBase64: `data:image/svg+xml;base64,${fs.readFileSync('./github.svg').toString('base64')}`
});

fs.writeFileSync('./badge.svg', svg);
