/**
 * Netlify Serverless Function: GitHub Contribution Calendar Scraper
 * Strictly public, zero token, zero API keys.
 * Fetches and parses: https://github.com/users/{username}/contributions
 * Returns canonical contributionCalendar JSON with totalContributions and weekly contributionDays.
 */

exports.handler = async (event, context) => {
  const username = (event.queryStringParameters && event.queryStringParameters.username) || "Lollipop0-0";

  // Sanitize username
  if (!/^[a-zA-Z0-9-]+$/.test(username)) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid GitHub username" })
    };
  }

  const url = `https://github.com/users/${encodeURIComponent(username)}/contributions`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Cache-Control": "no-cache"
      }
    });

    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: `GitHub returned status ${res.status}` })
      };
    }

    const html = await res.text();

    // 1. Extract headline total contributions description
    let totalContributions = 0;
    const headlineMatch = html.match(/([0-9,]+)\s+contributions?\s+in\s+the\s+last\s+year/i);
    if (headlineMatch) {
      totalContributions = parseInt(headlineMatch[1].replace(/,/g, ""), 10);
    }

    // 2. Parse tooltips for exact day counts
    const tooltips = {};
    const ttRegex = /<tool-tip[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/gi;
    let tm;
    while ((tm = ttRegex.exec(html)) !== null) {
      const cellId = tm[1];
      const tooltipText = tm[2].replace(/<[^>]+>/g, "").trim();
      let count = 0;
      const countMatch = tooltipText.match(/([0-9,]+)\s+contribution/i);
      if (countMatch) {
        count = parseInt(countMatch[1].replace(/,/g, ""), 10);
      }
      tooltips[cellId] = { count, text: tooltipText };
    }

    // 3. Parse calendar cells
    const matrix = {}; // matrix[col][row]
    const tdRegex = /<td[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>[\s\S]*?<\/td>/gi;
    let tdMatch;

    const levelMap = {
      0: "NONE",
      1: "FIRST_QUARTILE",
      2: "SECOND_QUARTILE",
      3: "THIRD_QUARTILE",
      4: "FOURTH_QUARTILE"
    };

    const colorMap = {
      0: "#ebedf0",
      1: "#9be9a8",
      2: "#40c463",
      3: "#30a14e",
      4: "#216e39"
    };

    while ((tdMatch = tdRegex.exec(html)) !== null) {
      const td = tdMatch[0];
      const dateMatch = td.match(/data-date="([0-9]{4}-[0-9]{2}-[0-9]{2})"/i);
      const lvlMatch = td.match(/data-level="([0-4])"/i);
      const idMatch = td.match(/id="([^"]+)"/i);
      const ixMatch = td.match(/data-ix="([0-9]+)"/i);

      if (dateMatch && lvlMatch && idMatch) {
        const date = dateMatch[1];
        const levelNum = parseInt(lvlMatch[1], 10);
        const cellId = idMatch[1];
        let colIdx = ixMatch ? parseInt(ixMatch[1], 10) : null;

        const count = tooltips[cellId] ? tooltips[cellId].count : (levelNum > 0 ? levelNum : 0);

        let rowIdx = 0;
        const idParts = cellId.match(/contribution-day-component-([0-9]+)-([0-9]+)/i);
        if (idParts) {
          rowIdx = parseInt(idParts[1], 10);
          if (colIdx === null) {
            colIdx = parseInt(idParts[2], 10);
          }
        } else {
          rowIdx = new Date(date).getUTCDay();
        }

        if (colIdx !== null) {
          if (!matrix[colIdx]) {
            matrix[colIdx] = {};
          }
          matrix[colIdx][rowIdx] = {
            date,
            contributionCount: count,
            contributionLevel: levelMap[levelNum] || "NONE",
            color: colorMap[levelNum] || "#ebedf0",
            weekday: rowIdx
          };
        }
      }
    }

    const sortedCols = Object.keys(matrix).map(Number).sort((a, b) => a - b);
    const weeks = [];
    let sumFromCells = 0;

    for (const col of sortedCols) {
      const rowKeys = Object.keys(matrix[col]).map(Number).sort((a, b) => a - b);
      const contributionDays = rowKeys.map(r => {
        const d = matrix[col][r];
        sumFromCells += d.contributionCount;
        return d;
      });
      const firstDay = contributionDays.length > 0 ? contributionDays[0].date : "";
      weeks.push({
        firstDay,
        contributionDays
      });
    }

    if (totalContributions === 0 && sumFromCells > 0) {
      totalContributions = sumFromCells;
    }

    const payload = {
      username,
      fetchedAt: new Date().toISOString(),
      contributionCalendar: {
        totalContributions,
        weeks
      }
    };

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=21600, s-maxage=21600" // 6 hours edge cache on Netlify CDN
      },
      body: JSON.stringify(payload)
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message || "Failed to fetch contributions" })
    };
  }
};
