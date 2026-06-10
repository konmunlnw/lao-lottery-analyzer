export function analyzeNumbers(draws: any[]) {
  const digitCount: Record<string, number> = {};

  for (let i = 0; i <= 9; i++) {
    digitCount[i.toString()] = 0;
  }

  draws.forEach((draw) => {
    const numbers =
      String(draw.number_6 || "") +
      String(draw.number_3 || "") +
      String(draw.number_2 || "");

    numbers.split("").forEach((digit) => {
      if (digitCount[digit] !== undefined) {
        digitCount[digit]++;
      }
    });
  });

  const sorted = Object.entries(digitCount).sort(
    (a, b) => b[1] - a[1]
  );

  const hotDigits = sorted
    .slice(0, 3)
    .map(([digit]) => digit);

  const coldDigits = [...sorted]
    .reverse()
    .slice(0, 3)
    .map(([digit]) => digit);

  return {
    hotDigits,
    coldDigits,

    suggested2: [
      hotDigits[0] + hotDigits[1],
      hotDigits[0] + hotDigits[2],
      hotDigits[1] + hotDigits[2],
      hotDigits[1] + hotDigits[0],
      hotDigits[2] + hotDigits[0],
    ],

    suggested3: [
      hotDigits.join(""),
      hotDigits[0] + hotDigits[2] + hotDigits[1],
      hotDigits[1] + hotDigits[0] + hotDigits[2],
    ],

    suggested4: [
      hotDigits.join("") + "1",
      hotDigits.join("") + "7",
      hotDigits.join("") + "9",
    ],
  };
}
export function analyze2DPositions(draws: any[]) {
  const tens: Record<string, number> = {};
  const units: Record<string, number> = {};

  for (let i = 0; i <= 9; i++) {
    tens[i.toString()] = 0;
    units[i.toString()] = 0;
  }

  draws.forEach((draw) => {
    const num = String(draw.number_2 || "").padStart(2, "0");

    const ten = num[0];
    const unit = num[1];

    tens[ten]++;
    units[unit]++;
  });

  const topTens = Object.entries(tens)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([digit]) => digit);

  const topUnits = Object.entries(units)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([digit]) => digit);

  const rankedSuggestions: {
  number: string;
  score: number;
}[] = [];

topTens.forEach((t) => {
  topUnits.forEach((u) => {
    const score =
      (tens[t] || 0) +
      (units[u] || 0);

    rankedSuggestions.push({
      number: t + u,
      score,
    });
  });
});

rankedSuggestions.sort(
  (a, b) => b.score - a.score
);

const suggestions = rankedSuggestions.map(
  (item) => item.number
);

const eliteSuggestions = rankedSuggestions
  .slice(0, 10)
  .map((item) => item.number);

return {
  topTens,
  topUnits,
  suggestions,
  eliteSuggestions,
  rankedSuggestions,
};
}
export function analyze4DPositions(draws: any[]) {
  const positions: Record<string, Record<string, number>> = {
    p1: {},
    p2: {},
    p3: {},
    p4: {},
  };

  const keys = ["p1", "p2", "p3", "p4"];

keys.forEach((key) => {
  for (let i = 0; i <= 9; i++) {
    positions[key][i.toString()] = 0;
  }
});

  draws.forEach((draw) => {
    const number6 = String(draw.number_6 || "").padStart(6, "0");
    const number4 = number6.slice(-4);

    positions.p1[number4[0]]++;
    positions.p2[number4[1]]++;
    positions.p3[number4[2]]++;
    positions.p4[number4[3]]++;
  });

  const getTop = (pos: Record<string, number>) =>
    Object.entries(pos)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([digit]) => digit);

  const topP1 = getTop(positions.p1);
  const topP2 = getTop(positions.p2);
  const topP3 = getTop(positions.p3);
  const topP4 = getTop(positions.p4);

  const suggestions: string[] = [];

  topP1.forEach((a) => {
    topP2.forEach((b) => {
      topP3.forEach((c) => {
        topP4.forEach((d) => {
          suggestions.push(a + b + c + d);
        });
      });
    });
  });

  return {
    topP1,
    topP2,
    topP3,
    topP4,
    suggestions,
  };
}
export function analyze2DTrend(draws: any[]) {
  const recent20 = draws.slice(0, 20);
  const recent50 = draws.slice(0, 50);
  const recent100 = draws.slice(0, 100);

  const scoreMap: Record<string, number> = {};

  for (let i = 0; i < 100; i++) {
    const num = i.toString().padStart(2, "0");

    scoreMap[num] = 0;

    const count20 = recent20.filter(
      (d) => d.number_2 === num
    ).length;

    const count50 = recent50.filter(
      (d) => d.number_2 === num
    ).length;

    const count100 = recent100.filter(
      (d) => d.number_2 === num
    ).length;

    scoreMap[num] =
      count20 * 5 +
      count50 * 3 +
      count100 * 1;
  }

  return Object.entries(scoreMap)
    .map(([number, score]) => ({
      number,
      score,
    }))
    .sort((a, b) => b.score - a.score);
}
export function analyzeHybridV7(draws: any[]) {
  const v5 = analyze2DPositions(draws);
  const trend = analyze2DTrend(draws).slice(0, 10);

  const scoreMap: Record<string, number> = {};

  const addScore = (num: string, score: number) => {
    scoreMap[num] = (scoreMap[num] || 0) + score;
  };

  v5.suggestions.forEach((num) => addScore(num, 3));
  v5.eliteSuggestions.forEach((num) => addScore(num, 5));
  trend.forEach((row, index) => addScore(row.number, 10 - index));

  return Object.entries(scoreMap)
    .map(([number, score]) => ({
      number,
      score,
    }))
    .sort((a, b) => b.score - a.score);
}
export function analyzeDynamicV8(draws: any[]) {
  const recent20 = draws.slice(0, 20);
  const recent50 = draws.slice(0, 50);
  const recent100 = draws.slice(0, 100);

  const scoreMap: Record<string, number> = {};

  for (let i = 0; i < 100; i++) {
    const num = i.toString().padStart(2, "0");
    scoreMap[num] = 0;

    const count20 = recent20.filter((d) => d.number_2 === num).length;
    const count50 = recent50.filter((d) => d.number_2 === num).length;
    const count100 = recent100.filter((d) => d.number_2 === num).length;

    const lastIndex = draws.findIndex((d) => d.number_2 === num);
    const missing = lastIndex === -1 ? draws.length : lastIndex;

    scoreMap[num] =
      count20 * 8 +
      count50 * 4 +
      count100 * 2 +
      Math.min(missing, 80) * 0.35;
  }

  const v5 = analyze2DPositions(draws);
  const trend = analyze2DTrend(draws).slice(0, 15);

  v5.eliteSuggestions.forEach((num) => {
    scoreMap[num] = (scoreMap[num] || 0) + 6;
  });

  trend.forEach((row, index) => {
    scoreMap[row.number] = (scoreMap[row.number] || 0) + (15 - index) *2;
  });

  return Object.entries(scoreMap)
    .map(([number, score]) => ({
      number,
      score,
    }))
    .sort((a, b) => b.score - a.score);
}