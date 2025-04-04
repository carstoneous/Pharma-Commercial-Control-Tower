// --- Pharma Commercial Control Tower JavaScript --- //

// Global variables
let dashboardData = null;
let salesChart = null;
let currentRegions = ['US', 'EU', 'Asia'];
let currentAiAction = 0;

// DOM load event
document.addEventListener('DOMContentLoaded', function() {
  initDashboard();
  
  // Initialize scroll animation observers
  const fadeElements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  fadeElements.forEach(el => {
    el.style.opacity = 0;
    observer.observe(el);
  });
  
  // Add event listeners for table sorting
  document.querySelectorAll('th').forEach(header => {
    header.addEventListener('click', () => {
      const table = header.closest('table');
      const index = Array.from(header.parentNode.children).indexOf(header);
      sortTable(table, index, header);
    });
  });
  
  // AI action dropdown change event
  const actionSelect = document.getElementById('action-select');
  if (actionSelect) {
    actionSelect.addEventListener('change', updateAiRecommendation);
  }
});

// Initialize dashboard with data
async function initDashboard() {
  try {
    // Show loader
    document.querySelectorAll('.loader').forEach(loader => {
      loader.style.display = 'flex';
    });
    
    // Direct data embedding instead of fetch
    dashboardData = {
      "months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      "sales": {
        "revenue": { 
          "US": [5.0, 5.2, 5.1, 5.3, 5.4, 5.6], 
          "EU": [4.0, 4.1, 4.0, 4.2, 4.3, 4.5], 
          "Asia": [3.0, 3.05, 3.0, 3.1, 3.2, 3.3] 
        },
        "marketShare": [22, 21, 20.5, 20.8, 21.2, 21.5],
        "conversion": { 
          "Direct": [15, 14, 15, 15.2, 15.5, 15.8], 
          "Digital": [10, 11, 10, 10.5, 11.2, 12.1] 
        },
        "forecastAccuracy": [88, 85, 82, 84, 86, 87],
        "volumeGrowth": [2.1, 1.8, 1.5, 1.9, 2.2, 2.5],
        "newPrescribers": [120, 105, 95, 110, 125, 140],
        "marketSegments": {
          "Hospital": [45, 44, 43, 44, 45, 46],
          "Retail": [30, 31, 32, 31, 30, 29],
          "Specialty": [25, 25, 25, 25, 25, 25]
        }
      },
      "market": {
        "competitorPrice": { 
          "CompA": [50, 49, 48, 48, 47, 47], 
          "CompB": [52, 51, 50, 49, 49, 48],
          "CompC": [55, 54, 54, 53, 53, 52]
        },
        "penetration": { 
          "US": 70, 
          "EU": 45, 
          "Asia": 60,
          "LatAm": 30,
          "Canada": 65
        },
        "launches": [1, 0, 2, 0, 1, 3],
        "patientShare": [18, 17.5, 17, 17.2, 17.5, 17.8],
        "marketTrends": {
          "growth": [3.2, 3.0, 2.8, 2.9, 3.1, 3.3],
          "seasonality": [1.0, 0.8, 0.9, 1.1, 1.2, 1.0]
        },
        "pricingImpact": {
          "elasticity": -0.7,
          "thresholds": [45, 50, 55]
        },
        "competitorPromotions": [
          {"month": "Jan", "competitor": "CompA", "type": "Rebate", "discount": "10%"},
          {"month": "Mar", "competitor": "CompB", "type": "Bundle", "discount": "15%"},
          {"month": "May", "competitor": "CompC", "type": "Digital", "discount": "5%"}
        ]
      },
      "engagement": {
        "hcpInteractions": { 
          "US": [6, 5, 5, 5.5, 6, 6.5], 
          "EU": [4, 4, 4, 4.5, 5, 5.5], 
          "Asia": [5, 6, 6, 6.5, 7, 7] 
        },
        "emailOpenRate": [25, 23, 22, 24, 26, 28],
        "nps": [40, 35, 32, 34, 37, 40],
        "clickThroughRate": [3.2, 3.0, 2.8, 3.1, 3.4, 3.7],
        "socialMediaEngagement": [2800, 3000, 3200, 3500, 4000, 4200],
        "hcpSegmentation": {
          "highValue": [80, 75, 70, 72, 75, 78],
          "midValue": [50, 48, 45, 47, 50, 52],
          "lowValue": [30, 28, 25, 26, 28, 30]
        },
        "engagementByChannel": {
          "F2F": [65, 60, 55, 58, 62, 65],
          "Virtual": [40, 45, 50, 52, 54, 55],
          "Email": [25, 23, 22, 24, 26, 28],
          "Social": [15, 16, 18, 20, 22, 25]
        },
        "contentPerformance": [
          {"title": "Clinical Data", "openRate": 32, "conversionRate": 5.2},
          {"title": "Patient Support", "openRate": 28, "conversionRate": 4.1},
          {"title": "Dosing Guide", "openRate": 45, "conversionRate": 7.8}
        ]
      },
      "ai": {
        "nextActions": [
          {"action": "Boost EU ad spend by 10%", "confidence": 92, "impact": "+$0.5M revenue", "timeToRealize": "2 months", "implementation": "Medium", "details": "Focus on Germany and France with targeted digital campaigns to HCPs in cardiology"},
          {"action": "Lower US price by 5%", "confidence": 85, "impact": "+2% market share", "timeToRealize": "3 months", "implementation": "Complex", "details": "Reduce list price and maintain rebate structure, targeting hospital segment specifically"},
          {"action": "Increase Asia HCP visits", "confidence": 88, "impact": "+$0.3M revenue", "timeToRealize": "1 month", "implementation": "Simple", "details": "Add 20% more rep visits in Japan and South Korea focusing on high-prescribing specialists"},
          {"action": "Launch patient support app", "confidence": 79, "impact": "+$0.2M revenue", "timeToRealize": "4 months", "implementation": "Complex", "details": "Develop mobile app with adherence tracking and refill reminders to improve persistence"},
          {"action": "Optimize EU payer rebates", "confidence": 83, "impact": "+$0.4M margin", "timeToRealize": "2 months", "implementation": "Medium", "details": "Restructure rebate tiers in Germany, Italy and Spain based on volume commitments"}
        ],
        "forecast": { 
          "baseline": 10000, 
          "predicted": 11200,
          "bestCase": 12500,
          "worstCase": 9800,
          "confidenceInterval": 85
        },
        "pricing": { 
          "current": 55, 
          "suggested": 52, 
          "marginImpact": 6,
          "volumeImpact": 8,
          "revenueImpact": 4.5
        },
        "segmentOpportunities": [
          {"segment": "Cardiologists", "potential": "High", "effort": "Medium", "roi": 3.2},
          {"segment": "Hospitals", "potential": "Medium", "effort": "High", "roi": 2.1},
          {"segment": "Primary Care", "potential": "Low", "effort": "Low", "roi": 1.5}
        ],
        "riskAnalysis": [
          {"risk": "Competitor price drop", "probability": "High", "impact": "Severe", "mitigation": "Prepare value-based messaging and targeted rebates"},
          {"risk": "Supply chain disruption", "probability": "Medium", "impact": "Moderate", "mitigation": "Increase safety stock by 15%"},
          {"risk": "Regulatory changes", "probability": "Low", "impact": "Severe", "mitigation": "Engage with policy makers proactively"}
        ]
      },
      "operations": {
        "supplyChain": {
          "stockLevels": [95, 92, 90, 93, 95, 97],
          "leadTimes": [45, 47, 48, 46, 44, 42],
          "manufacturingEfficiency": [88, 87, 86, 87, 89, 90]
        },
        "qualityMetrics": {
          "batchSuccess": [99.5, 99.3, 99.2, 99.4, 99.6, 99.7],
          "complaints": [12, 15, 14, 11, 9, 7]
        },
        "distributionNetwork": {
          "US": {"coverage": 95, "reliability": 98},
          "EU": {"coverage": 90, "reliability": 96},
          "Asia": {"coverage": 85, "reliability": 94}
        }
      }
    };
    
    // Initialize dashboard sections
    initSalesChart();
    initMarketHeatmap();
    initEngagementTable();
    initAiPanel();
    updateStats();
    
    // Initialize operations section if available
    if (dashboardData.operations) {
      initOperations();
    }
    
    // Hide loader
    document.querySelectorAll('.loader').forEach(loader => {
      loader.style.display = 'none';
    });
    
    // Add event listeners for region filters
    document.querySelectorAll('.region-filter').forEach(filter => {
      filter.addEventListener('click', toggleRegionFilter);
    });
  } catch (error) {
    console.error('Error initializing dashboard:', error);
    document.querySelectorAll('.error-message').forEach(el => {
      el.textContent = 'Error loading dashboard data. Please try again later.';
      el.style.display = 'block';
    });
  }
}

// Sales Chart Initialization
function initSalesChart() {
  const ctx = document.getElementById('sales-chart').getContext('2d');
  
  // Prepare datasets
  const datasets = [
    {
      label: 'US',
      data: dashboardData.sales.revenue.US,
      borderColor: '#FFFFFF',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      tension: 0.4,
      borderWidth: 3
    },
    {
      label: 'EU',
      data: dashboardData.sales.revenue.EU,
      borderColor: '#00FF99',
      backgroundColor: 'rgba(0, 255, 153, 0.1)',
      tension: 0.4,
      borderWidth: 3
    },
    {
      label: 'Asia',
      data: dashboardData.sales.revenue.Asia,
      borderColor: '#999999',
      backgroundColor: 'rgba(153, 153, 153, 0.1)',
      tension: 0.4,
      borderWidth: 3
    }
  ];
  
  // Create trend line (moving average)
  if (dashboardData.sales.revenue.US.length > 3) {
    const trendData = calculateMovingAverage([
      ...dashboardData.sales.revenue.US,
      ...dashboardData.sales.revenue.EU,
      ...dashboardData.sales.revenue.Asia
    ]);
    
    datasets.push({
      label: 'Trend',
      data: trendData,
      borderColor: 'rgba(255, 99, 132, 0.8)',
      backgroundColor: 'rgba(255, 99, 132, 0.1)',
      borderWidth: 2,
      borderDash: [5, 5],
      pointRadius: 0,
      tension: 0.4
    });
  }
  
  salesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dashboardData.months,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animations: {
        tension: {
          duration: 1000,
          easing: 'linear'
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(26, 32, 44, 0.9)',
          borderColor: '#00FF99',
          borderWidth: 1,
          titleColor: '#00FF99',
          titleAlign: 'center',
          bodyColor: '#FFFFFF',
          displayColors: true,
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': $' + context.raw + 'M';
            },
            footer: function(tooltipItems) {
              // Add volume growth data to tooltip
              const index = tooltipItems[0].dataIndex;
              if (dashboardData.sales.volumeGrowth && index < dashboardData.sales.volumeGrowth.length) {
                return 'Volume Growth: ' + dashboardData.sales.volumeGrowth[index] + '%';
              }
              return '';
            }
          }
        },
        annotation: {
          annotations: {
            line1: {
              type: 'line',
              yMin: 5.0,
              yMax: 5.0,
              borderColor: 'rgba(255, 255, 255, 0.5)',
              borderWidth: 1,
              borderDash: [5, 5],
              label: {
                content: 'US Target',
                enabled: true,
                position: 'end',
                backgroundColor: 'rgba(0, 0, 0, 0.7)'
              }
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#FFFFFF'
          }
        },
        y: {
          beginAtZero: false,
          min: 2.5,
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#FFFFFF',
            callback: function(value) {
              return '$' + value + 'M';
            }
          }
        }
      }
    }
  });
  
  // Add segment chart if data is available
  if (dashboardData.sales.marketSegments) {
    initSegmentChart();
  }
}

// Calculate moving average for trend visualization
function calculateMovingAverage(data, window = 3) {
  const result = [];
  
  // For the first points where we don't have enough history
  for (let i = 0; i < window - 1; i++) {
    result.push(null);
  }
  
  // Calculate moving average
  for (let i = window - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < window; j++) {
      sum += data[i - j];
    }
    result.push(sum / window);
  }
  
  return result;
}

// Initialize segment chart
function initSegmentChart() {
  const ctx = document.getElementById('segment-chart')?.getContext('2d');
  if (!ctx) return;
  
  const latestIndex = dashboardData.months.length - 1;
  
  const data = {
    labels: Object.keys(dashboardData.sales.marketSegments),
    datasets: [{
      data: Object.values(dashboardData.sales.marketSegments).map(segment => segment[latestIndex]),
      backgroundColor: [
        'rgba(0, 255, 153, 0.7)',
        'rgba(51, 204, 255, 0.7)',
        'rgba(255, 102, 102, 0.7)'
      ],
      borderColor: '#1A202C',
      borderWidth: 1
    }]
  };
  
  new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#FFFFFF'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(26, 32, 44, 0.9)',
          titleColor: '#00FF99',
          bodyColor: '#FFFFFF'
        }
      },
      cutout: '65%',
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  });
}

// Toggle region visibility in sales chart
function toggleRegionFilter(e) {
  const region = e.target.dataset.region;
  
  // Toggle active class
  e.target.classList.toggle('active');
  
  // Update current regions array
  if (currentRegions.includes(region)) {
    currentRegions = currentRegions.filter(r => r !== region);
  } else {
    currentRegions.push(region);
  }
  
  // Update chart visibility
  salesChart.data.datasets.forEach(dataset => {
    if (dataset.label === region) {
      dataset.hidden = !currentRegions.includes(region);
    }
  });
  
  salesChart.update();
}

// Initialize Market Heatmap
function initMarketHeatmap() {
  const heatmapContainer = document.getElementById('market-heatmap');
  const months = dashboardData.months;
  
  // Clear any existing content
  heatmapContainer.innerHTML = '';
  
  // Create heatmap cells
  months.forEach((month, index) => {
    const marketShare = dashboardData.sales.marketShare[index];
    const compAPrice = dashboardData.market.competitorPrice.CompA[index];
    const compBPrice = dashboardData.market.competitorPrice.CompB[index];
    const compCPrice = dashboardData.market.competitorPrice.CompC ? dashboardData.market.competitorPrice.CompC[index] : null;
    
    // Determine color based on market share (higher = greener)
    const normalizedShare = (marketShare - 20) / 2; // Range from 20-22%
    const greenValue = Math.min(255, Math.max(0, Math.round(normalizedShare * 255)));
    const redValue = Math.min(255, Math.max(0, Math.round((1 - normalizedShare) * 255)));
    const bgColor = `rgba(${redValue}, ${greenValue}, 0, 0.7)`;
    
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    cell.style.backgroundColor = bgColor;
    
    // Enhanced tooltip with more competitor info if available
    let tooltipText = `${month}: ${marketShare}% share, CompA $${compAPrice}, CompB $${compBPrice}`;
    if (compCPrice) {
      tooltipText += `, CompC $${compCPrice}`;
    }
    
    // Add trend indicator
    if (index > 0) {
      const prevShare = dashboardData.sales.marketShare[index - 1];
      const trend = marketShare > prevShare ? "↑" : marketShare < prevShare ? "↓" : "→";
      tooltipText += ` (${trend})`;
    }
    
    // Add competitor promotion info if available
    if (dashboardData.market.competitorPromotions) {
      const promotion = dashboardData.market.competitorPromotions.find(p => p.month === month);
      if (promotion) {
        tooltipText += `\n${promotion.competitor} ${promotion.type}: ${promotion.discount}`;
      }
    }
    
    cell.dataset.tooltip = tooltipText;
    
    const valueSpan = document.createElement('span');
    valueSpan.className = 'heatmap-value';
    valueSpan.textContent = `${marketShare}%`;
    
    const monthSpan = document.createElement('span');
    monthSpan.textContent = month;
    
    // Add trend indicator visual
    if (index > 0) {
      const trendIndicator = document.createElement('div');
      trendIndicator.className = 'trend-indicator';
      const prevShare = dashboardData.sales.marketShare[index - 1];
      
      if (marketShare > prevShare) {
        trendIndicator.textContent = '↑';
        trendIndicator.classList.add('trend-up');
      } else if (marketShare < prevShare) {
        trendIndicator.textContent = '↓';
        trendIndicator.classList.add('trend-down');
      } else {
        trendIndicator.textContent = '→';
        trendIndicator.classList.add('trend-neutral');
      }
      
      cell.appendChild(trendIndicator);
    }
    
    cell.appendChild(valueSpan);
    cell.appendChild(monthSpan);
    heatmapContainer.appendChild(cell);
  });
  
  // Initialize competitor price chart if element exists
  initCompetitorPriceChart();
  
  // Initialize patient share chart if data exists
  if (dashboardData.market.patientShare) {
    initPatientShareChart();
  }
  
  // Initialize market trends if data exists
  if (dashboardData.market.marketTrends) {
    initMarketTrendsChart();
  }
}

// Initialize Competitor Price Chart
function initCompetitorPriceChart() {
  const ctx = document.getElementById('competitor-price-chart')?.getContext('2d');
  if (!ctx) return;
  
  const datasets = [];
  
  // Add dataset for each competitor
  for (const [competitor, prices] of Object.entries(dashboardData.market.competitorPrice)) {
    let color;
    switch (competitor) {
      case 'CompA':
        color = 'rgba(255, 99, 132, 1)';
        break;
      case 'CompB':
        color = 'rgba(54, 162, 235, 1)';
        break;
      case 'CompC':
        color = 'rgba(255, 206, 86, 1)';
        break;
      default:
        color = 'rgba(153, 102, 255, 1)';
    }
    
    datasets.push({
      label: competitor,
      data: prices,
      borderColor: color,
      backgroundColor: color.replace('1)', '0.2)'),
      borderWidth: 2,
      tension: 0.4
    });
  }
  
  // Add our price if available
  if (dashboardData.ai.pricing) {
    const ourPriceData = Array(dashboardData.months.length).fill(dashboardData.ai.pricing.current);
    datasets.push({
      label: 'Our Price',
      data: ourPriceData,
      borderColor: 'rgba(0, 255, 153, 1)',
      backgroundColor: 'rgba(0, 255, 153, 0.2)',
      borderWidth: 3,
      tension: 0.4
    });
    
    // Add suggested price as dotted line
    const suggestedPriceData = Array(dashboardData.months.length).fill(dashboardData.ai.pricing.suggested);
    datasets.push({
      label: 'Suggested Price',
      data: suggestedPriceData,
      borderColor: 'rgba(0, 255, 153, 0.7)',
      backgroundColor: 'rgba(0, 255, 153, 0.1)',
      borderWidth: 2,
      borderDash: [5, 5],
      tension: 0
    });
  }
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dashboardData.months,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#FFFFFF'
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(26, 32, 44, 0.9)',
          borderColor: '#00FF99',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': $' + context.raw;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#FFFFFF'
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#FFFFFF',
            callback: function(value) {
              return '$' + value;
            }
          }
        }
      }
    }
  });
}

// Initialize Patient Share Chart
function initPatientShareChart() {
  const ctx = document.getElementById('patient-share-chart')?.getContext('2d');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dashboardData.months,
      datasets: [{
        label: 'Patient Share',
        data: dashboardData.market.patientShare,
        borderColor: 'rgba(0, 255, 153, 1)',
        backgroundColor: 'rgba(0, 255, 153, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(26, 32, 44, 0.9)',
          titleColor: '#00FF99',
          bodyColor: '#FFFFFF',
          callbacks: {
            label: function(context) {
              return 'Patient Share: ' + context.raw + '%';
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#FFFFFF'
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#FFFFFF',
            callback: function(value) {
              return value + '%';
            }
          }
        }
      }
    }
  });
}

// Initialize Market Trends Chart
function initMarketTrendsChart() {
  const ctx = document.getElementById('market-trends-chart')?.getContext('2d');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dashboardData.months,
      datasets: [
        {
          label: 'Market Growth',
          data: dashboardData.market.marketTrends.growth,
          borderColor: 'rgba(0, 255, 153, 1)',
          backgroundColor: 'rgba(0, 255, 153, 0.1)',
          yAxisID: 'y',
          borderWidth: 2,
          tension: 0.4
        },
        {
          label: 'Seasonality Factor',
          data: dashboardData.market.marketTrends.seasonality,
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.1)',
          yAxisID: 'y1',
          borderWidth: 2,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#FFFFFF'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(26, 32, 44, 0.9)'
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#FFFFFF'
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Growth %',
            color: '#00FF99'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#FFFFFF',
            callback: function(value) {
              return value + '%';
            }
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Seasonality',
            color: 'rgba(255, 159, 64, 1)'
          },
          grid: {
            drawOnChartArea: false
          },
          ticks: {
            color: '#FFFFFF'
          }
        }
      }
    }
  });
}

// Initialize Engagement Table
function initEngagementTable() {
  const tableBody = document.getElementById('engagement-table-body');
  if (!tableBody) return;
  
  // Clear existing rows
  tableBody.innerHTML = '';
  
  // Add regions as rows
  const regions = ['US', 'EU', 'Asia'];
  const lastMonthIndex = dashboardData.months.length - 1;
  
  regions.forEach(region => {
    const row = document.createElement('tr');
    
    // Region name
    const regionCell = document.createElement('td');
    regionCell.textContent = region;
    row.appendChild(regionCell);
    
    // HCP Interactions
    const hcpCell = document.createElement('td');
    const hcpValue = dashboardData.engagement.hcpInteractions[region][lastMonthIndex];
    const hcpPrev = dashboardData.engagement.hcpInteractions[region][lastMonthIndex - 1];
    const hcpTrend = hcpValue >= hcpPrev ? '↑' : '↓';
    hcpCell.textContent = `${hcpValue} ${hcpTrend}`;
    
    if (region === 'US' && hcpValue < hcpPrev) {
      hcpCell.dataset.tooltip = 'US: Engagement drop—boost visits';
      hcpCell.style.color = 'var(--danger)';
    } else if (region === 'Asia' && hcpValue > hcpPrev) {
      hcpCell.dataset.tooltip = 'Asia: Strong growth in HCP engagement';
      hcpCell.style.color = 'var(--success)';
    }
    
    row.appendChild(hcpCell);
    
    // Email Open Rate (same for all regions)
    const emailCell = document.createElement('td');
    emailCell.textContent = `${dashboardData.engagement.emailOpenRate[lastMonthIndex]}%`;
    if (dashboardData.engagement.emailOpenRate[lastMonthIndex] < dashboardData.engagement.emailOpenRate[lastMonthIndex - 1]) {
      emailCell.dataset.tooltip = 'Email open rates declining across regions';
      emailCell.style.color = 'var(--danger)';
    }
    row.appendChild(emailCell);
    
    // NPS (same for all regions)
    const npsCell = document.createElement('td');
    npsCell.textContent = dashboardData.engagement.nps[lastMonthIndex];
    if (dashboardData.engagement.nps[lastMonthIndex] < dashboardData.engagement.nps[lastMonthIndex - 1]) {
      npsCell.dataset.tooltip = 'NPS declining - customer satisfaction needs attention';
      npsCell.style.color = 'var(--danger)';
    }
    row.appendChild(npsCell);
    
    // Click Through Rate (if available)
    if (dashboardData.engagement.clickThroughRate) {
      const ctrCell = document.createElement('td');
      ctrCell.textContent = `${dashboardData.engagement.clickThroughRate[lastMonthIndex]}%`;
      
      if (dashboardData.engagement.clickThroughRate[lastMonthIndex] > dashboardData.engagement.clickThroughRate[lastMonthIndex - 1]) {
        ctrCell.style.color = 'var(--success)';
        ctrCell.dataset.tooltip = 'CTR improving - digital content resonating better';
      }
      
      row.appendChild(ctrCell);
    }
    
    // Social Media (if available)
    if (dashboardData.engagement.socialMediaEngagement) {
      const socialCell = document.createElement('td');
      const socialValue = dashboardData.engagement.socialMediaEngagement[lastMonthIndex];
      const socialPrev = dashboardData.engagement.socialMediaEngagement[lastMonthIndex - 1];
      
      socialCell.textContent = socialValue.toLocaleString();
      
      if (socialValue > socialPrev) {
        socialCell.style.color = 'var(--success)';
        const percentChange = Math.round((socialValue - socialPrev) / socialPrev * 100);
        socialCell.dataset.tooltip = `Social engagement up ${percentChange}% - social strategy working well`;
      }
      
      row.appendChild(socialCell);
    }
    
    tableBody.appendChild(row);
  });
  
  // Initialize HCP segmentation chart if data available
  if (dashboardData.engagement.hcpSegmentation) {
    initHcpSegmentationChart();
  }
  
  // Initialize channel engagement chart if data available
  if (dashboardData.engagement.engagementByChannel) {
    initChannelEngagementChart();
  }
  
  // Initialize content performance chart if data available
  if (dashboardData.engagement.contentPerformance) {
    initContentPerformanceChart();
  }
}

// Initialize HCP Segmentation Chart
function initHcpSegmentationChart() {
  const ctx = document.getElementById('hcp-segmentation-chart')?.getContext('2d');
  if (!ctx) return;
  
  const latestIndex = dashboardData.months.length - 1;
  
  const data = {
    labels: Object.keys(dashboardData.engagement.hcpSegmentation),
    datasets: [{
      label: 'Engagement Score',
      data: Object.values(dashboardData.engagement.hcpSegmentation).map(segment => segment[latestIndex]),
      backgroundColor: [
        'rgba(0, 255, 153, 0.7)',
        'rgba(255, 255, 0, 0.7)',
        'rgba(255, 99, 132, 0.7)'
      ],
      borderWidth: 1
    }]
  };
  
  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(26, 32, 44, 0.9)',
          callbacks: {
            label: function(context) {
              return 'Engagement Score: ' + context.raw;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#FFFFFF'
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#FFFFFF'
          }
        }
      }
    }
  });
}

// Initialize Channel Engagement Chart
function initChannelEngagementChart() {
  const ctx = document.getElementById('channel-engagement-chart')?.getContext('2d');
  if (!ctx) return;
  
  const latestIndex = dashboardData.months.length - 1;
  
  // Create datasets for current and previous month to show trend
  const currentMonthData = Object.values(dashboardData.engagement.engagementByChannel).map(channel => channel[latestIndex]);
  const prevMonthData = Object.values(dashboardData.engagement.engagementByChannel).map(channel => channel[latestIndex-1]);
  
  const data = {
    labels: Object.keys(dashboardData.engagement.engagementByChannel),
    datasets: [
      {
        label: dashboardData.months[latestIndex],
        data: currentMonthData,
        backgroundColor: 'rgba(0, 255, 153, 0.7)',
        borderColor: 'rgba(0, 255, 153, 1)',
        borderWidth: 1
      },
      {
        label: dashboardData.months[latestIndex-1],
        data: prevMonthData,
        backgroundColor: 'rgba(153, 153, 153, 0.7)',
        borderColor: 'rgba(153, 153, 153, 1)',
        borderWidth: 1
      }
    ]
  };
  
  new Chart(ctx, {
    type: 'radar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        line: {
          tension: 0.1
        }
      },
      scales: {
        r: {
          angleLines: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          pointLabels: {
            color: '#FFFFFF'
          },
          ticks: {
            color: '#FFFFFF',
            backdropColor: 'transparent'
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#FFFFFF'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(26, 32, 44, 0.9)',
          titleColor: '#00FF99'
        }
      }
    }
  });
}

// Initialize Content Performance Chart
function initContentPerformanceChart() {
  const ctx = document.getElementById('content-performance-chart')?.getContext('2d');
  if (!ctx) return;
  
  const titles = dashboardData.engagement.contentPerformance.map(item => item.title);
  const openRates = dashboardData.engagement.contentPerformance.map(item => item.openRate);
  const conversionRates = dashboardData.engagement.contentPerformance.map(item => item.conversionRate);
  
  const data = {
    labels: titles,
    datasets: [
      {
        label: 'Open Rate (%)',
        data: openRates,
        backgroundColor: 'rgba(0, 255, 153, 0.7)',
        borderColor: 'rgba(0, 255, 153, 1)',
        borderWidth: 1,
        yAxisID: 'y'
      },
      {
        label: 'Conversion Rate (%)',
        data: conversionRates,
        backgroundColor: 'rgba(255, 159, 64, 0.7)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
        yAxisID: 'y1'
      }
    ]
  };
  
  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#FFFFFF'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(26, 32, 44, 0.9)'
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#FFFFFF'
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Open Rate (%)',
            color: 'rgba(0, 255, 153, 1)'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#FFFFFF'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Conversion Rate (%)',
            color: 'rgba(255, 159, 64, 1)'
          },
          grid: {
            drawOnChartArea: false
          },
          ticks: {
            color: '#FFFFFF'
          }
        }
      }
    }
  });
}

// Initialize AI Panel
function initAiPanel() {
  const actionSelect = document.getElementById('action-select');
  if (!actionSelect) return;
  
  // Clear and populate action dropdown
  actionSelect.innerHTML = '';
  
  dashboardData.ai.nextActions.forEach((action, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = action.action;
    actionSelect.appendChild(option);
  });
  
  // Trigger change to update recommendation display
  updateAiRecommendation();
}

// Update AI recommendation display
function updateAiRecommendation() {
  const actionSelect = document.getElementById('action-select');
  const confidenceElement = document.getElementById('confidence-score');
  const impactElement = document.getElementById('impact-value');
  const detailsElement = document.getElementById('action-details');
  const timelineElement = document.getElementById('time-to-realize');
  const implementationElement = document.getElementById('implementation-complexity');
  
  const actionIndex = parseInt(actionSelect.value);
  const action = dashboardData.ai.nextActions[actionIndex];
  
  // Update confidence and impact with animation
  confidenceElement.textContent = '';
  impactElement.textContent = '';
  
  // Animate confidence score counting up
  let count = 0;
  const confidenceInterval = setInterval(() => {
    count += 1;
    confidenceElement.textContent = `${count}%`;
    if (count >= action.confidence) {
      clearInterval(confidenceInterval);
      confidenceElement.textContent = `${action.confidence}%`;
    }
  }, 20);
  
  // Fade in impact value
  setTimeout(() => {
    impactElement.style.opacity = 0;
    setTimeout(() => {
      impactElement.textContent = action.impact;
      impactElement.style.opacity = 1;
    }, 300);
  }, 600);
  
  // Update additional details if available
  if (detailsElement) {
    detailsElement.textContent = action.details || 'No additional details available';
  }
  
  if (timelineElement) {
    timelineElement.textContent = action.timeToRealize || 'Unknown';
  }
  
  if (implementationElement) {
    implementationElement.textContent = action.implementation || 'Medium';
    
    // Add visual indicator based on complexity
    implementationElement.className = 'implementation-tag';
    if (action.implementation === 'Simple') {
      implementationElement.classList.add('simple');
    } else if (action.implementation === 'Medium') {
      implementationElement.classList.add('medium');
    } else if (action.implementation === 'Complex') {
      implementationElement.classList.add('complex');
    }
  }
  
  // Update forecasting values
  document.getElementById('baseline-value').textContent = 
    '$' + dashboardData.ai.forecast.baseline.toLocaleString();
  document.getElementById('predicted-value').textContent = 
    '$' + dashboardData.ai.forecast.predicted.toLocaleString();
  
  // Update best/worst case if available
  if (dashboardData.ai.forecast.bestCase) {
    const bestCaseElement = document.getElementById('best-case-value');
    if (bestCaseElement) {
      bestCaseElement.textContent = '$' + dashboardData.ai.forecast.bestCase.toLocaleString();
    }
  }
  
  if (dashboardData.ai.forecast.worstCase) {
    const worstCaseElement = document.getElementById('worst-case-value');
    if (worstCaseElement) {
      worstCaseElement.textContent = '$' + dashboardData.ai.forecast.worstCase.toLocaleString();
    }
  }
  
  // Update confidence interval if available
  if (dashboardData.ai.forecast.confidenceInterval) {
    const confidenceIntervalElement = document.getElementById('confidence-interval');
    if (confidenceIntervalElement) {
      confidenceIntervalElement.textContent = dashboardData.ai.forecast.confidenceInterval + '%';
    }
  }
  
  // Update pricing suggestion
  document.getElementById('current-price').textContent = 
    '$' + dashboardData.ai.pricing.current;
  document.getElementById('suggested-price').textContent = 
    '$' + dashboardData.ai.pricing.suggested;
  document.getElementById('margin-impact').textContent = 
    dashboardData.ai.pricing.marginImpact + '%';
    
  // Update volume and revenue impact if available
  if (dashboardData.ai.pricing.volumeImpact) {
    const volumeImpactElement = document.getElementById('volume-impact');
    if (volumeImpactElement) {
      volumeImpactElement.textContent = '+' + dashboardData.ai.pricing.volumeImpact + '%';
    }
  }
  
  if (dashboardData.ai.pricing.revenueImpact) {
    const revenueImpactElement = document.getElementById('revenue-impact');
    if (revenueImpactElement) {
      revenueImpactElement.textContent = '+' + dashboardData.ai.pricing.revenueImpact + '%';
    }
  }
  
  // Render risk analysis if available
  if (dashboardData.ai.riskAnalysis) {
    renderRiskAnalysis();
  }
  
  // Render segment opportunities if available
  if (dashboardData.ai.segmentOpportunities) {
    renderSegmentOpportunities();
  }
}

// Render risk analysis
function renderRiskAnalysis() {
  const riskContainer = document.getElementById('risk-analysis');
  if (!riskContainer) return;
  
  riskContainer.innerHTML = '';
  
  dashboardData.ai.riskAnalysis.forEach(risk => {
    const riskCard = document.createElement('div');
    riskCard.className = 'risk-card';
    
    // Set color based on probability and impact
    if (risk.probability === 'High' && risk.impact === 'Severe') {
      riskCard.classList.add('high-risk');
    } else if (risk.probability === 'Low' && (risk.impact === 'Low' || risk.impact === 'Moderate')) {
      riskCard.classList.add('low-risk');
    } else {
      riskCard.classList.add('medium-risk');
    }
    
    const riskTitle = document.createElement('h4');
    riskTitle.textContent = risk.risk;
    
    const riskDetails = document.createElement('div');
    riskDetails.className = 'risk-details';
    
    const probability = document.createElement('span');
    probability.textContent = `Probability: ${risk.probability}`;
    
    const impact = document.createElement('span');
    impact.textContent = `Impact: ${risk.impact}`;
    
    const mitigation = document.createElement('p');
    mitigation.textContent = risk.mitigation;
    
    riskDetails.appendChild(probability);
    riskDetails.appendChild(impact);
    
    riskCard.appendChild(riskTitle);
    riskCard.appendChild(riskDetails);
    riskCard.appendChild(mitigation);
    
    riskContainer.appendChild(riskCard);
  });
}

// Render segment opportunities
function renderSegmentOpportunities() {
  const opportunityContainer = document.getElementById('segment-opportunities');
  if (!opportunityContainer) return;
  
  opportunityContainer.innerHTML = '';
  
  // Sort by ROI descending
  const sortedOpportunities = [...dashboardData.ai.segmentOpportunities].sort((a, b) => b.roi - a.roi);
  
  sortedOpportunities.forEach(segment => {
    const segmentCard = document.createElement('div');
    segmentCard.className = 'segment-card';
    
    // Set color based on potential
    if (segment.potential === 'High') {
      segmentCard.classList.add('high-potential');
    } else if (segment.potential === 'Medium') {
      segmentCard.classList.add('medium-potential');
    } else {
      segmentCard.classList.add('low-potential');
    }
    
    const segmentTitle = document.createElement('h4');
    segmentTitle.textContent = segment.segment;
    
    const roiBadge = document.createElement('div');
    roiBadge.className = 'roi-badge';
    roiBadge.textContent = `ROI: ${segment.roi}x`;
    
    const details = document.createElement('div');
    details.className = 'segment-details';
    
    const potential = document.createElement('span');
    potential.textContent = `Potential: ${segment.potential}`;
    
    const effort = document.createElement('span');
    effort.textContent = `Effort: ${segment.effort}`;
    
    details.appendChild(potential);
    details.appendChild(effort);
    
    segmentCard.appendChild(segmentTitle);
    segmentCard.appendChild(roiBadge);
    segmentCard.appendChild(details);
    
    opportunityContainer.appendChild(segmentCard);
  });
}

// Update Stats
function updateStats() {
  // Get latest month index
  const latestMonth = dashboardData.months.length - 1;
  
  // Update sales stats
  document.getElementById('market-share').textContent = 
    dashboardData.sales.marketShare[latestMonth] + '%';
  
  document.getElementById('direct-conversion').textContent = 
    dashboardData.sales.conversion.Direct[latestMonth] + '%';
  
  document.getElementById('digital-conversion').textContent = 
    dashboardData.sales.conversion.Digital[latestMonth] + '%';
  
  document.getElementById('forecast-accuracy').textContent = 
    dashboardData.sales.forecastAccuracy[latestMonth] + '%';
  
  // Update volume growth and new prescribers if available
  if (dashboardData.sales.volumeGrowth) {
    const volumeGrowthElement = document.getElementById('volume-growth');
    if (volumeGrowthElement) {
      volumeGrowthElement.textContent = dashboardData.sales.volumeGrowth[latestMonth] + '%';
      
      // Add trend indicator
      if (latestMonth > 0) {
        const prevGrowth = dashboardData.sales.volumeGrowth[latestMonth - 1];
        const currentGrowth = dashboardData.sales.volumeGrowth[latestMonth];
        
        if (currentGrowth > prevGrowth) {
          volumeGrowthElement.innerHTML += ' <span style="color: var(--success)">↑</span>';
        } else if (currentGrowth < prevGrowth) {
          volumeGrowthElement.innerHTML += ' <span style="color: var(--danger)">↓</span>';
        }
      }
    }
  }
  
  if (dashboardData.sales.newPrescribers) {
    const newPrescribersElement = document.getElementById('new-prescribers');
    if (newPrescribersElement) {
      newPrescribersElement.textContent = dashboardData.sales.newPrescribers[latestMonth];
      
      // Add trend indicator
      if (latestMonth > 0) {
        const prevPrescribers = dashboardData.sales.newPrescribers[latestMonth - 1];
        const currentPrescribers = dashboardData.sales.newPrescribers[latestMonth];
        
        if (currentPrescribers > prevPrescribers) {
          newPrescribersElement.innerHTML += ' <span style="color: var(--success)">↑</span>';
        } else if (currentPrescribers < prevPrescribers) {
          newPrescribersElement.innerHTML += ' <span style="color: var(--danger)">↓</span>';
        }
      }
    }
  }
  
  // Update market stats - add support for more regions if available
  document.getElementById('us-penetration').textContent = 
    dashboardData.market.penetration.US + '%';
  
  document.getElementById('eu-penetration').textContent = 
    dashboardData.market.penetration.EU + '%';
  
  document.getElementById('asia-penetration').textContent = 
    dashboardData.market.penetration.Asia + '%';
  
  // Add other regions if available
  const additionalRegions = ['LatAm', 'Canada'];
  additionalRegions.forEach(region => {
    const regionElement = document.getElementById(`${region.toLowerCase()}-penetration`);
    if (regionElement && dashboardData.market.penetration[region]) {
      regionElement.textContent = dashboardData.market.penetration[region] + '%';
    }
  });
  
  document.getElementById('recent-launches').textContent = 
    dashboardData.market.launches[latestMonth];
}

// Table Sorting Function
function sortTable(table, columnIndex, header) {
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  
  // Toggle sort direction
  const isAscending = !header.classList.contains('sort-asc');
  
  // Remove sort classes from all headers
  table.querySelectorAll('th').forEach(th => {
    th.classList.remove('sort-asc', 'sort-desc');
  });
  
  // Add sort class to clicked header
  header.classList.add(isAscending ? 'sort-asc' : 'sort-desc');
  
  // Sort rows
  rows.sort((a, b) => {
    const aValue = a.cells[columnIndex].textContent.trim();
    const bValue = b.cells[columnIndex].textContent.trim();
    
    // Remove non-numeric characters for numeric comparison
    const aNumeric = parseFloat(aValue.replace(/[^\d.-]/g, ''));
    const bNumeric = parseFloat(bValue.replace(/[^\d.-]/g, ''));
    
    // Check if values are numeric
    if (!isNaN(aNumeric) && !isNaN(bNumeric)) {
      return isAscending ? aNumeric - bNumeric : bNumeric - aNumeric;
    } else {
      // String comparison
      return isAscending ? 
        aValue.localeCompare(bValue) : 
        bValue.localeCompare(aValue);
    }
  });
  
  // Rebuild table
  rows.forEach(row => tbody.appendChild(row));
  
  // Add animation to sorted rows
  rows.forEach((row, index) => {
    row.style.animation = 'none';
    row.offsetHeight; // Trigger reflow
    row.style.animation = `fadeIn 0.3s ease forwards ${index * 0.05}s`;
  });
}

// Initialize Operations Section if data is available
function initOperations() {
  if (!dashboardData.operations) return;
  
  // Initialize supply chain metrics
  if (dashboardData.operations.supplyChain) {
    initSupplyChainChart();
  }
  
  // Initialize quality metrics
  if (dashboardData.operations.qualityMetrics) {
    initQualityMetricsChart();
  }
  
  // Initialize distribution network
  if (dashboardData.operations.distributionNetwork) {
    initDistributionNetworkChart();
  }
}

// Initialize Supply Chain Chart
function initSupplyChainChart() {
  const ctx = document.getElementById('supply-chain-chart')?.getContext('2d');
  if (!ctx) return;
  
  const data = {
    labels: dashboardData.months,
    datasets: [
      {
        label: 'Stock Levels (%)',
        data: dashboardData.operations.supplyChain.stockLevels,
        backgroundColor: 'rgba(0, 255, 153, 0.1)',
        borderColor: 'rgba(0, 255, 153, 1)',
        tension: 0.4,
        yAxisID: 'y',
        borderWidth: 2
      },
      {
        label: 'Lead Times (days)',
        data: dashboardData.operations.supplyChain.leadTimes,
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.4,
        yAxisID: 'y1',
        borderWidth: 2
      },
      {
        label: 'Manufacturing Efficiency (%)',
        data: dashboardData.operations.supplyChain.manufacturingEfficiency,
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.4,
        yAxisID: 'y',
        borderWidth: 2,
        hidden: true
      }
    ]
  };
  
  new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#FFFFFF'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(26, 32, 44, 0.9)',
          titleColor: '#00FF99'
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#FFFFFF'
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Percentage (%)',
            color: '#FFFFFF'
          },
          min: 80,
          max: 100,
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#FFFFFF'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Days',
            color: '#FFFFFF'
          },
          min: 40,
          max: 50,
          grid: {
            drawOnChartArea: false
          },
          ticks: {
            color: '#FFFFFF'
          }
        }
      }
    }
  });
}

// Initialize Quality Metrics Chart
function initQualityMetricsChart() {
  const ctx = document.getElementById('quality-metrics-chart')?.getContext('2d');
  if (!ctx) return;
  
  const data = {
    labels: dashboardData.months,
    datasets: [
      {
        type: 'line',
        label: 'Batch Success Rate (%)',
        data: dashboardData.operations.qualityMetrics.batchSuccess,
        backgroundColor: 'rgba(0, 255, 153, 0.1)',
        borderColor: 'rgba(0, 255, 153, 1)',
        tension: 0.4,
        yAxisID: 'y',
        borderWidth: 2
      },
      {
        type: 'bar',
        label: 'Complaints',
        data: dashboardData.operations.qualityMetrics.complaints,
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        yAxisID: 'y1',
        borderWidth: 1
      }
    ]
  };
  
  new Chart(ctx, {
    type: 'scatter',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#FFFFFF'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(26, 32, 44, 0.9)',
          titleColor: '#00FF99'
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#FFFFFF'
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Success Rate (%)',
            color: '#FFFFFF'
          },
          min: 99,
          max: 100,
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#FFFFFF'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Complaints (Count)',
            color: '#FFFFFF'
          },
          min: 0,
          max: 20,
          grid: {
            drawOnChartArea: false
          },
          ticks: {
            color: '#FFFFFF'
          }
        }
      }
    }
  });
}

// Initialize Distribution Network Chart
function initDistributionNetworkChart() {
  const ctx = document.getElementById('distribution-network-chart')?.getContext('2d');
  if (!ctx) return;
  
  const regions = Object.keys(dashboardData.operations.distributionNetwork);
  const coverageData = regions.map(region => dashboardData.operations.distributionNetwork[region].coverage);
  const reliabilityData = regions.map(region => dashboardData.operations.distributionNetwork[region].reliability);
  
  const data = {
    labels: regions,
    datasets: [
      {
        label: 'Coverage (%)',
        data: coverageData,
        backgroundColor: 'rgba(0, 255, 153, 0.7)',
        borderColor: 'rgba(0, 255, 153, 1)',
        borderWidth: 1
      },
      {
        label: 'Reliability (%)',
        data: reliabilityData,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };
  
  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#FFFFFF'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(26, 32, 44, 0.9)'
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#FFFFFF'
          }
        },
        y: {
          min: 80,
          max: 100,
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#FFFFFF',
            callback: function(value) {
              return value + '%';
            }
          }
        }
      }
    }
  });
} 