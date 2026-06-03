export function calculateScores(draws: any[]) {
  const frequency: Record<string, number> = {};
  const missing: Record<string, number> = {};

  for (let i = 0; i < 100; i++) {
    const num = i.toString().padStart(2, "0");

    frequency[num] = 0;
    missing[num] = 0;
  }

  draws.forEach((draw) => {
    const num = draw.number_2;

    if (frequency[num] !== undefined) {
      frequency[num]++;
    }
  });

  for (let i = 0; i < 100; i++) {
    const target = i.toString().padStart(2, "0");

    let miss = 0;

    for (const draw of draws) {
      if (draw.number_2 === target) {
        break;
      }

      miss++;
    }

    missing[target] = miss;
  }

  const result = [];

  for (let i = 0; i < 100; i++) {
    const num = i.toString().padStart(2, "0");

    const score =
  (frequency[num] * 5) +
  (missing[num] / 50);

    result.push({
      number: num,
      frequency: frequency[num],
      missing: missing[num],
      score,
    });
  }

  return result.sort(
    (a, b) => b.score - a.score
  );
}