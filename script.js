const data = {
    cost: {
      overMilage: 0.5,
      abroad: 25
    },
    dayPasses: [
      { duration: 1, freeKm: 100, price: 95 },
      { duration: 2, freeKm: 200, price: 170 },
      { duration: 3, freeKm: 300, price: 230 },
      { duration: 4, freeKm: 400, price: 260 },
      { duration: 5, freeKm: 500, price: 325 },
      { duration: 6, freeKm: 600, price: 390 },
      { duration: 7, freeKm: 700, price: 455 },
      { duration: 8, freeKm: 800, price: 520 },
      { duration: 9, freeKm: 900, price: 585 },
      { duration: 10, freeKm: 1000, price: 650 },
      { duration: 11, freeKm: 1100, price: 715 },
      { duration: 12, freeKm: 1200, price: 780 },
      { duration: 13, freeKm: 1300, price: 815 },
      { duration: 14, freeKm: 1400, price: 910 }
    ],
    subscription: {
      price: 50,
      overMilageDiscount: 0.3,
      dayPassDiscount: 0.2
    },
    creditPacks: [
      { name: "XL", discount: 200, price: 160 },
      { name: "L", discount: 150, price: 125 },
      { name: "M", discount: 100, price: 85 },
      { name: "S", discount: 50, price: 45 }
    ]
  };
  
  function calculateCost() {
    const durationInput = document.getElementById("duration");
    const distanceInput = document.getElementById("distance");
    const subscriptionInput = document.getElementById("subscription");
    const abroadInput = document.getElementById("abroad");
    const resultElement = document.getElementById("result");
  
    const duration = parseInt(durationInput.value);
    const distance = parseInt(distanceInput.value);
    const isSubscription = subscriptionInput.checked;
    const isAbroad = abroadInput.checked;
  
    let totalCost = 0;
    let costWithPacks = 0;
    let cheapestPacks = [];
  
    if (duration > 0) {
      const dayPass = data.dayPasses.find((pass) => pass.duration === duration);
      if (dayPass) {
        let dayPassCost = dayPass.price;
        if (isSubscription) {
          dayPassCost -= dayPassCost * data.subscription.dayPassDiscount;
        }
  
        let excessDistance = Math.max(distance - dayPass.freeKm, 0);
  
        const overMilageDiscount = isSubscription ? data.subscription.overMilageDiscount : 0;
        const overMilageCost = excessDistance * (data.cost.overMilage - data.cost.overMilage * overMilageDiscount);
  
        totalCost += dayPassCost + overMilageCost;
        costWithPacks = totalCost;
  
        // Check if over-mileage cost without packs is greater than the lowest credit pack price
        const lowestPackPrice = data.creditPacks.reduce((minPrice, pack) => Math.min(minPrice, pack.price), Infinity);
  
        if (overMilageCost > lowestPackPrice) {
          const creditPacks = data.creditPacks.slice().sort((a, b) => a.price - b.price);
  
          for (let i = 0; i < creditPacks.length; i++) {
            const pack = creditPacks[i];
            const packCount = Math.floor(excessDistance / (pack.discount * data.cost.overMilage));
            excessDistance %= pack.discount * data.cost.overMilage;
  
            if (packCount > 0) {
              cheapestPacks.push({ pack: pack.name, count: packCount });
              costWithPacks -= pack.price * packCount;
            }
          }
        }
      }
    }
  
    if (isSubscription) {
      totalCost += data.subscription.price;
      costWithPacks += data.subscription.price;
    }
  
    if (isAbroad) {
      totalCost += data.cost.abroad;
      costWithPacks += data.cost.abroad;
    }
  
    let resultText = `Total Cost: €${totalCost}`;
    if (cheapestPacks.length > 0) {
      resultText += `<br>Cost with Credit Packs: €${costWithPacks.toFixed(2)}`;
      resultText += `<br>Cheaper with Credit Packs: `;
      for (let i = 0; i < cheapestPacks.length; i++) {
        const { pack, count } = cheapestPacks[i];
        resultText += `${count} ${pack} Pack${count > 1 ? "s" : ""}, `;
      }
      resultText = resultText.slice(0, -2);
    }
    resultElement.innerHTML = resultText;
  }
  
  document.getElementById("duration").addEventListener("input", calculateCost);
  document.getElementById("distance").addEventListener("input", calculateCost);
  document.getElementById("subscription").addEventListener("change", calculateCost);
  document.getElementById("abroad").addEventListener("change", calculateCost);
  
  calculateCost();