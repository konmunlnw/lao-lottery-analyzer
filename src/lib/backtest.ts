import { supabase } from "@/lib/supabase";
import {
  analyze2DPositions,
  analyze2DTrend,
  analyzeHybridV7,
  analyzeDynamicV8,
} from "./analyzer";

export function testPositionAnalyzer(draws: any[]) {
  let hits = 0;
  let total = 0;

  for (let i = 50; i < draws.length - 1; i++) {
    const history = draws.slice(i);
    const analysis = analyze2DPositions(history);
    const nextDraw = draws[i - 1];

    if (analysis.suggestions.includes(nextDraw.number_2)) hits++;
    total++;
  }

  return {
    hits,
    total,
    accuracy: total > 0 ? ((hits / total) * 100).toFixed(2) : "0",
  };
}

export function testPositionEliteAnalyzer(draws: any[]) {
  let hits = 0;
  let total = 0;

  for (let i = 50; i < draws.length - 1; i++) {
    const history = draws.slice(i);
    const analysis = analyze2DPositions(history);
    const nextDraw = draws[i - 1];

    if ((analysis.eliteSuggestions || []).includes(nextDraw.number_2)) hits++;
    total++;
  }

  return {
    hits,
    total,
    accuracy: total > 0 ? ((hits / total) * 100).toFixed(2) : "0",
  };
}

export function testTrendAnalyzer(draws: any[]) {
  let hits = 0;
  let total = 0;

  for (let i = 100; i < draws.length - 1; i++) {
    const history = draws.slice(i);
    const analysis = analyze2DTrend(history);
    const top10 = analysis.slice(0, 10).map((row) => row.number);
    const nextDraw = draws[i - 1];

    if (top10.includes(nextDraw.number_2)) hits++;
    total++;
  }

  return {
    hits,
    total,
    accuracy: total > 0 ? ((hits / total) * 100).toFixed(2) : "0",
  };
}

export function testHybridV7Analyzer(draws: any[]) {
  let hits = 0;
  let total = 0;

  for (let i = 100; i < draws.length - 1; i++) {
    const history = draws.slice(i);
    const analysis = analyzeHybridV7(history);
    const top10 = analysis.slice(0, 10).map((row) => row.number);
    const nextDraw = draws[i - 1];

    if (top10.includes(nextDraw.number_2)) hits++;
    total++;
  }

  return {
    hits,
    total,
    accuracy: total > 0 ? ((hits / total) * 100).toFixed(2) : "0",
  };
}

export function testDynamicV8Analyzer(draws: any[]) {
  let hits = 0;
  let total = 0;

  for (let i = 100; i < draws.length - 1; i++) {
    const history = draws.slice(i);
    const predictions = analyzeDynamicV8(history)
      .slice(0, 10)
      .map((row) => row.number);

    const nextDraw = draws[i - 1];

    if (predictions.includes(nextDraw.number_2)) {
      hits++;
    }

    total++;
  }

  return {
    hits,
    total,
    accuracy: total > 0 ? ((hits / total) * 100).toFixed(2) : "0",
  };
}
