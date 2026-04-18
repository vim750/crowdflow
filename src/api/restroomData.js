// Restroom data helper to enrich stadium facilities
export const getEnrichedRestrooms = (stadium) => {
  if (!stadium || !stadium.seating || !stadium.seating.facilities) return [];

  const restrooms = stadium.seating.facilities.filter(f => f.type === 'restroom');

  const cleanlinessLevels = ["Spotless", "Clean", "Needs Attention"];
  const crowdLevels = ["Low", "Medium", "High"];

  return restrooms.map((r, i) => ({
    ...r,
    id: `r-${stadium.id}-${i}`,
    rating: (4 + Math.random()).toFixed(1),
    cleanliness: cleanlinessLevels[Math.floor(Math.random() * cleanlinessLevels.length)],
    crowd: crowdLevels[Math.floor(Math.random() * crowdLevels.length)],
    features: ["Handicap Accessible", "Soap Available", "Hand Dryer"].filter(() => Math.random() > 0.4),
    lastCleaned: `${Math.floor(Math.random() * 60)} mins ago`,
    reviews: [
      { user: "Rahul", rating: 5, comment: "Very clean and no wait time." },
      { user: "Priya", rating: 4, comment: "It was okay, soap was low." }
    ]
  }));
};
