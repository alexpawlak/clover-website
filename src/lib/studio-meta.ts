import { execSync } from 'node:child_process';

export const STUDIO_NAME = 'Clover Studio';
export const STUDIO_SUBTITLE = 'Offers and photo moderation';

export type StudioMeta = {
  updatedLabel: string | null;
  updatedTooltip: string | null;
};

function formatVisibleUpdate(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatDetailedUpdate(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getStudioMeta(): StudioMeta {
  try {
    const latestRaw = execSync('git log -1 --format=%ci%n%s', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();

    const [commitDateRaw, ...messageLines] = latestRaw.split('\n');
    const commitMessage = messageLines.join(' ').trim();
    const commitDate = new Date(commitDateRaw);

    if (Number.isNaN(commitDate.getTime())) {
      return { updatedLabel: null, updatedTooltip: null };
    }

    let updatedTooltip = `Updated ${formatDetailedUpdate(commitDate)}`;
    if (commitMessage) updatedTooltip += `\n\nLatest change:\n- ${commitMessage}`;

    try {
      const changelogRaw = execSync('git log -5 --format=%cs|%s', {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();

      const changelogLines = changelogRaw
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
          const [date, ...rest] = line.split('|');
          const summary = rest.join('|').trim();
          return summary ? `- ${date}: ${summary}` : `- ${date}`;
        });

      if (changelogLines.length > 0) {
        updatedTooltip += `\n\nRecent updates:\n${changelogLines.join('\n')}`;
      }
    } catch {
      // Fall back to the latest change only if changelog extraction fails.
    }

    return {
      updatedLabel: `Updated ${formatVisibleUpdate(commitDate)}`,
      updatedTooltip,
    };
  } catch {
    return { updatedLabel: null, updatedTooltip: null };
  }
}
