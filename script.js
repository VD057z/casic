document.addEventListener('DOMContentLoaded', function() {
    const emojis = ["🍒", "🍋", "🍊", "🍇", "⭐"];
    const slot1Wrapper = document.querySelector('#slot1').parentElement;
     const slot2Wrapper = document.querySelector('#slot2').parentElement;
    const slot3Wrapper = document.querySelector('#slot3').parentElement;
     const slot1 = document.getElementById('slot1');
    const slot2 = document.getElementById('slot2');
    const slot3 = document.getElementById('slot3');
   const spinButton = document.getElementById('spinButton');
    const resultMessage = document.getElementById('resultMessage');
   const modal = document.getElementById('resultModal');
     const modalTitle = document.getElementById('modal-title');
   const modalMessage = document.getElementById('modal-message');
    const modalEmoji = document.getElementById('modal-emoji');
     const closeModalButton = document.getElementById('closeModalButton');
   const modalResultEmojis = document.createElement('div');
     modalResultEmojis.classList.add('modal-result-emojis');

    const baseWeights = {
        "🍒": 15,
        "🍋": 10,
        "🍊": 8,
        "🍇": 6,
       "⭐": 1
   };
   let weights = {};
    for (let key in baseWeights) {
        if (baseWeights.hasOwnProperty(key)) {
            weights[key] = baseWeights[key];
        }
    }
   const almostChanceMultiplier = 0.5;
   const jackpotChanceMultiplier = 0.1;

    function generateSlot(weights) {
        let totalWeight = 0;
       for (const key in weights) {
            if (weights.hasOwnProperty(key)) {
                totalWeight += weights[key];
            }
        }

        let randomNum = Math.random() * totalWeight;
        let weightSum = 0;
       for (const emoji in weights) {
            if (weights.hasOwnProperty(emoji)) {
                weightSum += weights[emoji];
                if (randomNum <= weightSum) {
                    return emoji;
                }
            }
        }
        return null;
   }

    function spinSlots(weights) {
        return [generateSlot(weights), generateSlot(weights), generateSlot(weights)];
   }


    function checkWin(slots) {
        if ((slots[0] === slots[1] && slots[1] === slots[2]) && (Math.random() < jackpotChanceMultiplier)) {
            return "win";
      } else if ((slots[0] === slots[1] || slots[0] === slots[2] || slots[1] === slots[2]) && (Math.random() < almostChanceMultiplier)) {
           return "almost";
       } else {
            return "lose";
       }
   }


    const jackpotSound = new Audio('jackpot.wav');
   const almostSound = new Audio('almost.wav');
    const loseSound = new Audio('lose.wav');
     const stopSound = new Audio('stop.wav');


    let isSpinning = false;

    spinButton.addEventListener('click', function() {
        if (isSpinning) return;
        isSpinning = true;
       resultMessage.textContent = "";
        const slots = spinSlots(weights);

       let startTime = null;
       const duration1 = 2200;
        const duration2 = 2800;
        const duration3 = 3400;
        const numberOfChanges = 20;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
           const progress = timestamp - startTime;

            const progress1 = Math.min(1, progress / duration1);
           const progress2 = Math.min(1, progress / duration2);
           const progress3 = Math.min(1, progress / duration3);


            if (progress < Math.max(duration1, duration2, duration3)) {
                const changeCount1 = Math.floor(progress1 * numberOfChanges);
                const changeCount2 = Math.floor(progress2 * numberOfChanges);
                const changeCount3 = Math.floor(progress3 * numberOfChanges);


                 slot1Wrapper.innerHTML = '';
               let temp1 = '';
                for (let i = 0; i < changeCount1; i++) {
                    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
                    temp1 += `<div class='slot'>${emoji}</div>`
               }
                slot1Wrapper.innerHTML = temp1;


                slot2Wrapper.innerHTML = '';
                let temp2 = '';
                for (let i = 0; i < changeCount2; i++) {
                    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
                    temp2 += `<div class='slot'>${emoji}</div>`
                }
                slot2Wrapper.innerHTML = temp2;

                 slot3Wrapper.innerHTML = '';
                let temp3 = '';
                for (let i = 0; i < changeCount3; i++) {
                     const emoji = emojis[Math.floor(Math.random() * emojis.length)];
                     temp3 += `<div class='slot'>${emoji}</div>`
                }
                slot3Wrapper.innerHTML = temp3;

              requestAnimationFrame(animate);


           } else {
               slot1Wrapper.innerHTML = '';
               slot2Wrapper.innerHTML = '';
               slot3Wrapper.innerHTML = '';
                const el1 = document.createElement("div");
                el1.textContent = slots[0];
                el1.classList.add('slot');
               slot1Wrapper.appendChild(el1);
             stopSound.play();

                setTimeout(() => {
                    const el2 = document.createElement("div");
                    el2.textContent = slots[1];
                     el2.classList.add('slot');
                   slot2Wrapper.appendChild(el2);
                   stopSound.play();


                    setTimeout(() => {
                       const el3 = document.createElement("div");
                        el3.textContent = slots[2];
                        el3.classList.add('slot');
                      slot3Wrapper.appendChild(el3);
                      stopSound.play();

                       const winResult = checkWin(slots);
                      modalResultEmojis.innerHTML = '';
                       slots.forEach(emoji => {
                          const el = document.createElement('div');
                          el.textContent = emoji;
                          el.classList.add('slot');
                           modalResultEmojis.appendChild(el);
                        })

                        modal.classList.add('show');
                           modalEmoji.textContent = '';
                        modal.querySelector('.modal-content').insertBefore(modalResultEmojis, modal.querySelector('p'))

                        if (winResult === "win") {
                           modalTitle.textContent = "!!!ДЖЕКПОТ!!!";
                            modalMessage.textContent = "Вы выиграли! Поздравляем!";
                           modalEmoji.textContent = '🎉';
                            jackpotSound.play();
                       } else if (winResult === "almost") {
                            modalTitle.textContent = "Почти!";
                            modalMessage.textContent = "Вы возвращаете потраченную сумму!";
                             modalEmoji.textContent = '🤔';
                            almostSound.play();
                       } else {
                           modalTitle.textContent = "Увы!";
                            modalMessage.textContent = "Эх бывают в жизни огорчения, но ты не расстраивайся!";
                            modalEmoji.textContent = '😔';
                            loseSound.play();
                       }
                        isSpinning = false;
                    }, 200);
                }, 200);
            }
       };
       requestAnimationFrame(animate);
  });

    closeModalButton.addEventListener('click', function() {
        modal.classList.remove('show');
        modalResultEmojis.remove();
        slot1.textContent = '❓';
        slot2.textContent = '❓';
        slot3.textContent = '❓';
         slot1Wrapper.innerHTML = `<div class="slot" id="slot1">❓</div>`;
        slot2Wrapper.innerHTML = `<div class="slot" id="slot2">❓</div>`;
       slot3Wrapper.innerHTML = `<div class="slot" id="slot3">❓</div>`;
    });
});