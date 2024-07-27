import fs from 'fs';
import { makeBadge } from 'badge-maker';

const gitHubSvgLogo = fs.readFileSync('./github.svg');

const svg = makeBadge({
  label: 'coverage',
  message: '100%',
  labelColor: '#353B43',
  color: '#30BD50',
  logoBase64: `data:image/svg+xml;base64,${gitHubSvgLogo.toString('base64')}`
});

fs.writeFileSync('./badge.svg', svg);
