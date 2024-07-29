import fs from 'fs';
import { makeBadge } from 'badge-maker';
import core from '@actions/core';
import github from '@actions/github';

const label = core.getInput('label');
const path = core.getInput('coverage-summary-path');
const style = core.getInput('style');

const styles = ['github', 'classic'];
if (!styles.includes(style)) {
  core.setFailed(`invalid style, expected one of [${styles.join(', ')}]`);
  process.exit(1);
}

const branch = github.context.ref.split('refs/heads/').pop();
core.info(`branch: ${branch}`);

const report = JSON.parse(fs.readFileSync(path, 'utf8'));
const coverage = Math.min(...`lines|statements|functions|branches`.split(`|`).map((k) => report.total[k].pct), 0);
core.info(`coverage: ${coverage}%`);

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
