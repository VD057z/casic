document.addEventListener('DOMContentLoaded', function() {
    const emojis = ["🍒", "🍋", "🍊", "🍇", "⭐"];
    const slot1 = document.getElementById('slot1');
    const slot2 = document.getElementById('slot2');
    const slot3 = document.getElementById('slot3');
    const spinButton = document.getElementById('spinButton');
    const resultMessage = document.getElementById('resultMessage');

    function generateSlot(weights) {
        let totalWeight = 0;
        for (const key in weights) {
            totalWeight += weights[key];
        }

        let randomNum = Math.random() * totalWeight;
        let weightSum = 0;

        for (const emoji in weights)
        {
          weightSum += weights[emoji];
          if(randomNum <= weightSum) return emoji;
        }
        return null;
    }

     function spinSlots(weights) {
         return [generateSlot(weights), generateSlot(weights), generateSlot(weights)];
     }

    function checkWin(slots) {
        if (slots[0] === slots[1] && slots[1] === slots[2]) {
            return "win";
        } else if (slots[0] === slots[1] || slots[0] === slots[2] || slots[1] === slots[2]) {
            return "almost";
        } else {
            return "lose";
        }
    }


    function displaySlots(slots) {
        slot1.textContent = slots[0];
        slot2.textContent = slots[1];
        slot3.textContent = slots[2];
    }

    const weights = {
      "🍒": 5,
      "🍋": 7,
      "🍊": 11,
      "🍇": 9,
      "⭐": 1
    };

    spinButton.addEventListener('click', function() {
        const slots = spinSlots(weights);
        displaySlots(slots);

         const winResult = checkWin(slots);

        if (winResult === "win") {
            resultMessage.textContent = "!!!ДЖЕКПОТ!!! 3 ЮНИКА";
        } else if (winResult === "almost"){
          resultMessage.textContent = "Вы возвращаете потраченную сумму!";
        } else {
            resultMessage.textContent = "Эх бывают в жизни огорчения, но ты не расстраивайся!";
        }
    });
});