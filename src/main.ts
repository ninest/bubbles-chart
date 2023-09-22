import * as d3 from "d3";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")!;

function generateReviews(n, m) {
  const reviews = [];

  // Generate n positive reviews
  for (let i = 0; i < n; i++) {
    const size = Math.floor(Math.random() * 4) + 1; // Random size between 1 and 4
    reviews.push({ word: String.fromCharCode(65 + i), type: "positive", size });
  }

  // Generate m negative reviews
  for (let i = 0; i < m; i++) {
    const size = Math.floor(Math.random() * 4) + 1; // Random size between 1 and 4
    reviews.push({ word: String.fromCharCode(65 + n + i), type: "negative", size });
  }

  return reviews;
}

const reviews = generateReviews(30, 20);

// const reviews = [
//   // { word: "A", type: "positive", size: 3 },
//   // { word: "B", type: "positive", size: 4 },
//   // { word: "C", type: "positive", size: 2 },
//   // { word: "D", type: "negative", size: 1 },
//   // { word: "E", type: "negative", size: 2 },
//   // { word: "F", type: "negative", size: 1 },
// ];
// const reviews = Array.

const margin = { top: 0, bottom: 0, left: 0, right: 0 };

const width = 300 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

const svg = d3
  .select("#app")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

function circlePacking() {
  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  const gg = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  const positiveGroup = d3.group(reviews, (review) => review.type == "positive");
  const negativeGroup = d3.group(reviews, (review) => review.type == "negative");

  const hierarchy = d3
    .hierarchy({
      children: [
        // {
        //   children: [{ children: positiveGroup.get(true) }, { children: negativeGroup.get(true) }],
        // },
        ...(positiveGroup.get(true) ?? []),
        ...(negativeGroup.get(true) ?? []),
      ],
    })
    // Sort by size
    .sum((review) => review.size)
    // .sort((a, b) => {
    //   if (a.data.type === "positive" && b.data.type === "negative") {
    //     return -1; // 'a' comes before 'b'
    //   } else if (a.data.type === "negative" && b.data.type === "positive") {
    //     return 1; // 'b' comes before 'a'
    //   }

    //   return b.value - a.value;
    // });

  const pack = d3.pack().padding(5).size([width, height]);

  const root = pack(hierarchy);

  // console.log(root.descendants().slice(1, 4));

  g.selectAll("circle")
    .data(root.descendants().slice(0, 1))
    .join("circle")
    .attr("r", (d) => d.r)
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("opacity", 0.6)
    .attr("fill", (d) => `#aaaaaa`);

  // Review circles
  gg.selectAll("circle")
    .data(root.descendants().slice(1))
    .join("circle")
    .attr("r", (d) => d.r)
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    // .attr("opacity", 0)
    .attr("fill", (d) => {
      const type = d.data.type;
      return type == "positive" ? `#11ff11` : `#ff1111`;
    });
}

function differentShapePacking() {
  const packer = d3.pack();
  // packer([{ a: 1 }]);
}
circlePacking();
// differentShapePacking()
