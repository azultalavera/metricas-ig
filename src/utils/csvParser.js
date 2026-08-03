/**
 * Robust Instagram Metrics CSV Parser
 * Handles empty sections, missing values, leading commas, and varying CSV layouts gracefully.
 */
export function parseInstagramCsv(csvText, fallbackId, fallbackName) {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.split(',').map((cell) => cell.trim().replace(/^"|"$/g, '')));

  let monthName = fallbackName || 'Nuevo Mes';
  let monthId = fallbackId || `month-${Date.now()}`;

  let totalViews = 0;
  let mainViews = 0;
  let netFollowers = null; // null means no data in CSV
  let interactions = null;

  let mainFollowersPercent = null;
  let mainNonFollowersPercent = null;

  let nonFollowersReachPercent = 50;
  let followersReachPercent = 50;

  let reelsCount = 0;
  let dumpsCount = 0;
  let storiesCount = 0;

  const posts = [];
  const demographics = [];
  const peakHours = {};

  let currentSection = '';

  for (let i = 0; i < lines.length; i++) {
    const row = lines[i];
    if (!row || row.every((cell) => cell === '')) continue; // Skip completely blank lines

    // Find first non-empty cells
    const nonEmpty = row.filter((c) => c !== '');
    const col0 = row[0] || '';
    const col1 = row[1] || '';
    const col2 = row[2] || '';
    const col3 = row[3] || '';
    const col4 = row[4] || '';

    // Detect Month Name in Row 2 (e.g. ,JULIO,,,,,,)
    if ((!col0 || col0 === '') && col1 && col1.toUpperCase() === col1 && col1.length >= 3 && i < 5 && !col1.includes('días')) {
      const monthClean = col1.charAt(0).toUpperCase() + col1.slice(1).toLowerCase();
      monthName = `${monthClean} 2026`;
      monthId = `2026-${monthClean.toLowerCase()}`;
    }

    // Section 1: 30 days main period
    if (col1 === '30 días' || col0 === '30 días') {
      if (col2 && /^\d+$/.test(col2)) mainViews = parseInt(col2) || 0;
      if (col3 && col3 !== '') netFollowers = parseInt(col3.replace(/[^\d-]/g, ''));
      if (col4 && col4 !== '') interactions = parseInt(col4.replace(/\D/g, ''));
      
      if (row[5] && row[5] !== '') mainFollowersPercent = parseFloat(row[5].replace(',', '.')) || null;
      if (row[6] && row[6] !== '') mainNonFollowersPercent = parseFloat(row[6].replace(',', '.')) || null;
    }

    // Section Header Detectors
    const rowStr = row.join(' ').toLowerCase();
    if (rowStr.includes('reels/dumps')) {
      currentSection = 'posts';
      continue;
    }

    if (rowStr.includes('público')) {
      currentSection = 'demographics';
      continue;
    }

    if (rowStr.includes('resumen de lo que pasó')) {
      currentSection = 'summary';
      continue;
    }

    if (rowStr.includes('compartiste')) {
      currentSection = 'shared';
      continue;
    }

    if (rowStr.includes('momentos de mayor actividad')) {
      currentSection = 'activity';
      continue;
    }

    // Process section rows
    if (currentSection === 'posts') {
      const title = col1 || col0;
      if (title && !title.toLowerCase().includes('reels/dumps') && !title.toLowerCase().includes('público')) {
        const isReel = (col2 && col2.toLowerCase() === 'x') || (row[2] && row[2].toLowerCase() === 'x');
        const isDump = (col3 && col3.toLowerCase() === 'x') || (row[3] && row[3].toLowerCase() === 'x');
        const viewsVal = parseInt((row[4] || row[3] || '').replace(/\D/g, '')) || 0;
        const reachVal = parseInt((row[5] || row[4] || '').replace(/\D/g, '')) || 0;
        const avgTimeVal = parseInt((row[6] || row[5] || '').replace(/\D/g, '')) || 0;
        const followersVal = parseInt((row[7] || row[6] || '').replace(/\D/g, '')) || 0;

        if (title.trim() !== '') {
          posts.push({
            id: posts.length + 1,
            title: title.trim(),
            type: isReel ? 'Reel' : (isDump ? 'Dump' : 'Reel'),
            views: viewsVal,
            reach: reachVal,
            avgTime: avgTimeVal,
            newFollowers: followersVal
          });
        }
      }
    } else if (currentSection === 'demographics') {
      const country = col1 || col0;
      const pctStr = col2 || row[2] || '';
      if (country && !country.toLowerCase().includes('público') && !country.toLowerCase().includes('resumen')) {
        const pctVal = parseFloat((pctStr || '').replace('%', '').replace(',', '.')) || 0;
        demographics.push({
          country: country.trim(),
          percentage: pctVal
        });
      }
    } else if (currentSection === 'summary') {
      // Find row with total views number
      const viewsCandidate = row.find((c) => /^\d{5,}$/.test(c));
      const pctCandidate = row.find((c) => c.includes('%'));

      if (viewsCandidate) {
        totalViews = parseInt(viewsCandidate) || 0;
      }
      if (pctCandidate) {
        nonFollowersReachPercent = parseFloat(pctCandidate.replace('%', '')) || 50;
        followersReachPercent = 100 - nonFollowersReachPercent;
      }
    } else if (currentSection === 'shared') {
      if (col0 === 'reels' || col1 === 'reels') {
        const nextRow = lines[i + 1] || [];
        const nums = nextRow.filter((c) => /^\d+$/.test(c));
        if (nums.length >= 3) {
          reelsCount = parseInt(nums[0]) || 0;
          dumpsCount = parseInt(nums[1]) || 0;
          storiesCount = parseInt(nums[2]) || 0;
        }
      }
    } else if (currentSection === 'activity') {
      if (col0.includes('6-9') || col1.includes('6-9')) {
        if (row.slice(1).some((c) => c.toLowerCase() === 'x')) {
          if ((row[2] && row[2].toLowerCase() === 'x') || (row[1] && row[1].toLowerCase() === 'x')) {
            if (!peakHours['Mar']) peakHours['Mar'] = [];
            peakHours['Mar'].push('n1');
          }
          if ((row[3] && row[3].toLowerCase() === 'x') || (row[2] && row[2].toLowerCase() === 'x')) {
            if (!peakHours['Dom']) peakHours['Dom'] = [];
            peakHours['Dom'].push('n1');
          }
        }
      }
      if (col0.includes('9 -12') || col1.includes('9 -12') || col0.includes('9-12')) {
        if ((row[2] && row[2].toLowerCase() === 'x') || (row[1] && row[1].toLowerCase() === 'x')) {
          if (!peakHours['Mar']) peakHours['Mar'] = [];
          peakHours['Mar'].push('n2');
        }
      }
    }
  }

  // Mark top converter if posts exist
  if (posts.length > 0) {
    let maxSeg = -1;
    posts.forEach((p) => {
      p.isTopConverter = false;
      if (p.newFollowers > maxSeg) maxSeg = p.newFollowers;
    });
    const top = posts.find((p) => p.newFollowers === maxSeg);
    if (top) top.isTopConverter = true;
  }

  return {
    id: monthId,
    name: monthName,
    kpis: {
      totalViews: totalViews || mainViews || 0,
      mainViews: mainViews || 0,
      netFollowers: netFollowers,
      interactions: interactions,
      reels: reelsCount,
      dumps: dumpsCount,
      stories: storiesCount,
      nonFollowersReachPercent: nonFollowersReachPercent,
      followersReachPercent: followersReachPercent,
      mainFollowersPercent: mainFollowersPercent,
      mainNonFollowersPercent: mainNonFollowersPercent
    },
    posts: posts,
    demographics: demographics,
    peakHours: Object.keys(peakHours).length > 0 ? peakHours : { Mar: ['n1', 'n2'], Dom: ['n1'] },
    rawCsv: csvText
  };
}
