
let hand = [];
let dealerUpcard = null;
let hasAdded = false;

function switchTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`.tab[onclick="switchTab('${tabId}')"]`).classList.add('active');
    document.getElementById(`${tabId}-tab`).classList.add('active');
}

function getAction() {
    const card1 = document.getElementById('card1').value.trim().toUpperCase();
    const card2 = document.getElementById('card2').value.trim().toUpperCase();
    const dealerCard = document.getElementById('dealerCard').value.trim().toUpperCase();
    const additionalCard = document.getElementById('additionalCard').value.trim().toUpperCase();
    const resultDiv = document.getElementById('result');
    const additionalCardsDiv = document.getElementById('additional-cards');

    // Validate inputs
    const validCards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    if (!validCards.includes(card1) || !validCards.includes(card2) || !validCards.includes(dealerCard)) {
        showError('Invalid card. Use 2-10, J, Q, K, or A.');
        return;
    }
    if (additionalCard && !validCards.includes(additionalCard)) {
        showError('Invalid additional card. Use 2-10, J, Q, K, or A.');
        return;
    }

    // Initialize hand if this is the first action
    if (!hasAdded) {
        hand = [card1, card2];
        dealerUpcard = dealerCard;
    }

    // Add the new card if provided
    if (additionalCard) {
        hand.push(additionalCard);
        document.getElementById('additionalCard').value = '';
    }

    // Calculate the value of each card
    const getCardValue = (card) => {
        if (['J', 'Q', 'K'].includes(card)) return 10;
        if (card === 'A') return 11; // We'll adjust for Ace later
        return parseInt(card);
    };

    // Calculate hand total and handle Aces
    let total = 0;
    let aceCount = 0;
    for (let card of hand) {
        if (card === 'A') aceCount++;
        total += getCardValue(card);
    }
    while (total > 21 && aceCount > 0) {
        total -= 10; // Count an Ace as 1 instead of 11
        aceCount--;
    }

    // Check for bust
    if (total > 21) {
        displayResult('Bust', `You have busted with ${total}. The dealer wins this hand.`);
        return;
    }

    // Determine if it's a soft total (Ace counted as 11)
    const isSoft = aceCount > 0 && total <= 21;

    // Get dealer upcard value
    const dealerValue = getCardValue(dealerUpcard);

    // Check if it's a pair (for splitting)
    const isPair = hand.length === 2 && hand[0] === hand[1];

    // Basic strategy logic
    let action = '';
    let explanation = '';

    // If we've added a card, we can only Hit or Stand (no Double or Split)
    if (hand.length > 2) {
        // Post-initial decision logic
        if (total >= 17) {
            action = 'Stand';
            explanation = 'With a total of 17 or more, you should stand as the risk of busting is too high.';
        } else if (total >= 13 && total <= 16) {
            if (dealerValue >= 2 && dealerValue <= 6) {
                action = 'Stand';
                explanation = 'Against a dealer weak card (2-6), stand on 13-16 as the dealer has a higher chance of busting.';
            } else {
                action = 'Hit';
                explanation = 'Against a dealer strong card (7-Ace), you need to improve your hand as the dealer is less likely to bust.';
            }
        } else if (total === 12) {
            if (dealerValue >= 4 && dealerValue <= 6) {
                action = 'Stand';
                explanation = 'Against dealer 4-6, stand on 12 as the dealer has a higher chance of busting.';
            } else {
                action = 'Hit';
                explanation = 'Against dealer 2-3 or 7-Ace, hit on 12 to try to improve your hand.';
            }
        } else if (total <= 11) {
            action = 'Hit';
            explanation = 'With a total of 11 or less, you cannot bust with one card, so always hit.';
        }

        // Special handling for soft totals after hitting
        if (isSoft) {
            const nonAceValue = total - 11;
            if (nonAceValue <= 6) {
                action = 'Hit';
                explanation = 'With a soft hand (A-2 to A-6), hit to try to improve your hand.';
            } else if (nonAceValue === 7) {
                if (dealerValue >= 9) {
                    action = 'Hit';
                    explanation = 'With soft 18 against dealer 9-Ace, hit to try to improve.';
                } else {
                    action = 'Stand';
                    explanation = 'With soft 18 against dealer 2-8, stand as you have a decent hand.';
                }
            }
        }
    } else {
        // Initial two-card hand: can Double, Split, Hit, or Stand
        
        // 1. Check for blackjack first
        if (hand.includes('A') && (hand.includes('10') || hand.includes('J') || hand.includes('Q') || hand.includes('K'))) {
            action = 'Stand';
            explanation = 'Blackjack! You have 21 - stand and wait to see if the dealer matches.';
        }
        // 2. Check for pairs
        else if (isPair) {
            switch (hand[0]) {
                case 'A':
                case '8':
                    action = 'Split';
                    explanation = 'Always split Aces and 8s for maximum advantage.';
                    break;
                case '9':
                    if (dealerValue === 7 || dealerValue >= 10) {
                        action = 'Stand';
                        explanation = 'With pair of 9s against dealer 7, 10 or Ace, stand (18 is strong).';
                    } else {
                        action = 'Split';
                        explanation = 'Split 9s against dealer 2-6, 8 or 9 for better opportunities.';
                    }
                    break;
                case '7':
                    if (dealerValue <= 7) {
                        action = 'Split';
                        explanation = 'Split 7s against dealer 2-7 to improve your position.';
                    } else {
                        action = 'Hit';
                        explanation = 'Against dealer 8-Ace, hit with 7s as splitting isn\'t favorable.';
                    }
                    break;
                case '6':
                    if (dealerValue <= 6) {
                        action = 'Split';
                        explanation = 'Split 6s against dealer 2-6 to improve your position.';
                    } else {
                        action = 'Hit';
                        explanation = 'Against dealer 7-Ace, hit with 6s as splitting isn\'t favorable.';
                    }
                    break;
                case '4':
                    if (dealerValue === 5 || dealerValue === 6) {
                        action = 'Split';
                        explanation = 'Split 4s only against dealer 5 or 6.';
                    } else {
                        action = 'Hit';
                        explanation = 'Against other dealer cards, hit with 4s as splitting isn\'t favorable.';
                    }
                    break;
                case '2':
                case '3':
                    if (dealerValue <= 7) {
                        action = 'Split';
                        explanation = `Split ${hand[0]}s against dealer 2-7 to maximize your chances.`;
                    } else {
                        action = 'Hit';
                        explanation = `Against dealer 8-Ace, hit with ${hand[0]}s as splitting isn't favorable.`;
                    }
                    break;
                default: // 5, 10, J, Q, K
                    if (hand[0] === '5') {
                        if (dealerValue <= 9) {
                            action = 'Double';
                            explanation = 'With two 5s (10 total), double down against dealer 2-9.';
                        } else {
                            action = 'Hit';
                            explanation = 'Against dealer 10 or Ace, hit with two 5s (10 total).';
                        }
                    } else {
                        action = 'Stand';
                        explanation = 'Never split 10-value cards as 20 is a very strong hand.';
                    }
            }
        }
        // 3. Check for soft hands
        else if (isSoft) {
            const nonAceValue = total - 11;
            if (nonAceValue === 2 || nonAceValue === 3) {
                if (dealerValue >= 5 && dealerValue <= 6) {
                    action = 'Double';
                    explanation = `With soft ${nonAceValue+11} (A-${nonAceValue}) against dealer 5-6, double down.`;
                } else {
                    action = 'Hit';
                    explanation = `With soft ${nonAceValue+11} (A-${nonAceValue}) against other cards, hit.`;
                }
            }
            else if (nonAceValue === 4 || nonAceValue === 5) {
                if (dealerValue >= 4 && dealerValue <= 6) {
                    action = 'Double';
                    explanation = `With soft ${nonAceValue+11} (A-${nonAceValue}) against dealer 4-6, double down.`;
                } else {
                    action = 'Hit';
                    explanation = `With soft ${nonAceValue+11} (A-${nonAceValue}) against other cards, hit.`;
                }
            }
            else if (nonAceValue === 6) {
                if (dealerValue >= 3 && dealerValue <= 6) {
                    action = 'Double';
                    explanation = `With soft ${nonAceValue+11} (A-${nonAceValue}) against dealer 3-6, double down.`;
                } else {
                    action = 'Hit';
                    explanation = `With soft ${nonAceValue+11} (A-${nonAceValue}) against other cards, hit.`;
                }
            }
            else if (nonAceValue === 7) {
                if (dealerValue >= 3 && dealerValue <= 6) {
                    action = 'Double';
                    explanation = `With soft ${nonAceValue+11} (A-${nonAceValue}) against dealer 3-6, double down.`;
                } else if (dealerValue === 2 || dealerValue === 7 || dealerValue === 8) {
                    action = 'Stand';
                    explanation = `With soft ${nonAceValue+11} (A-${nonAceValue}) against dealer 2,7,8, stand.`;
                } else {
                    action = 'Hit';
                    explanation = `With soft ${nonAceValue+11} (A-${nonAceValue}) against dealer 9-Ace, hit.`;
                }
            }
            else if (nonAceValue === 8) {
                if (dealerValue === 6) {
                    action = 'Double';
                    explanation = 'With soft 19 (A-8) against dealer 6, double down.';
                } else {
                    action = 'Stand';
                    explanation = 'With soft 19 (A-8), stand against other dealer cards.';
                }
            }
            else {
                action = 'Stand';
                explanation = `With soft ${total}, stand as you have a strong hand.`;
            }
        }
        // 4. Handle hard totals
        else {
            if (total <= 8) {
                action = 'Hit';
                explanation = 'With 8 or less, always hit as you cannot bust.';
            }
            else if (total === 9) {
                if (dealerValue >= 3 && dealerValue <= 6) {
                    action = 'Double';
                    explanation = 'With 9 against dealer 3-6, double down.';
                } else {
                    action = 'Hit';
                    explanation = 'With 9 against other dealer cards, hit.';
                }
            }
            else if (total === 10) {
                if (dealerValue <= 9) {
                    action = 'Double';
                    explanation = 'With 10 against dealer 2-9, double down.';
                } else {
                    action = 'Hit';
                    explanation = 'With 10 against dealer 10-Ace, hit.';
                }
            }
            else if (total === 11) {
                action = 'Double';
                explanation = 'With 11, always double down when possible.';
            }
            else if (total === 12) {
                if (dealerValue >= 4 && dealerValue <= 6) {
                    action = 'Stand';
                    explanation = 'With 12 against dealer 4-6, stand.';
                } else {
                    action = 'Hit';
                    explanation = 'With 12 against other dealer cards, hit.';
                }
            }
            else if (total >= 13 && total <= 16) {
                if (dealerValue <= 6) {
                    action = 'Stand';
                    explanation = `With ${total} against dealer 2-6, stand.`;
                } else {
                    action = 'Hit';
                    explanation = `With ${total} against dealer 7-Ace, hit.`;
                }
            }
            else {
                action = 'Stand';
                explanation = `With ${total}, always stand.`;
            }
        }
    }

    displayResult(action, explanation);

    // Show the additional cards section if the action is "Hit" and total is less than 21
    if (action === 'Hit' && total < 21) {
        additionalCardsDiv.style.display = 'block';
        hasAdded = true;
    } else {
        additionalCardsDiv.style.display = 'none';
        hasAdded = false;
    }
}

function displayResult(action, explanation) {
    const total = calculateTotal();
    const isSoft = calculateIsSoft();
    const isPair = hand.length === 2 && hand[0] === hand[1];

    document.getElementById('result-hand').textContent = hand.join(' + ');
    document.getElementById('result-total').textContent = total;
    document.getElementById('result-dealer').textContent = dealerUpcard;
    document.getElementById('result-type').textContent = isPair ? 'Pair' : isSoft ? 'Soft Hand' : 'Hard Hand';
    
    const actionElement = document.getElementById('result-action');
    actionElement.textContent = action;
    actionElement.className = 'action-value ' + getActionClass(action);
    
    document.getElementById('action-explanation').textContent = explanation;
    document.getElementById('result').style.display = 'block';
}

function calculateTotal() {
    let total = 0;
    let aceCount = 0;
    
    for (let card of hand) {
        if (card === 'A') {
            total += 11;
            aceCount++;
        } else if (['J', 'Q', 'K'].includes(card)) {
            total += 10;
        } else {
            total += parseInt(card);
        }
    }
    
    while (total > 21 && aceCount > 0) {
        total -= 10;
        aceCount--;
    }
    
    return total;
}

function calculateIsSoft() {
    let total = 0;
    let aceCount = 0;
    
    for (let card of hand) {
        if (card === 'A') {
            total += 11;
            aceCount++;
        } else if (['J', 'Q', 'K'].includes(card)) {
            total += 10;
        } else {
            total += parseInt(card);
        }
    }
    
    return aceCount > 0 && total <= 21;
}

function getActionClass(action) {
    switch(action) {
        case 'Hit': return 'action-hit';
        case 'Stand': return 'action-stand';
        case 'Double': return 'action-double';
        case 'Split': return 'action-split';
        case 'Bust': return 'action-bust';
        default: return '';
    }
}

function addCard() {
    getAction();
}

function stand() {
    document.getElementById('additional-cards').style.display = 'none';
    hasAdded = false;
}

function resetForm() {
    document.getElementById('card1').value = '';
    document.getElementById('card2').value = '';
    document.getElementById('dealerCard').value = '';
    document.getElementById('additionalCard').value = '';
    document.getElementById('result').style.display = 'none';
    document.getElementById('additional-cards').style.display = 'none';
    hand = [];
    dealerUpcard = null;
    hasAdded = false;
}

function showError(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <div style="color: var(--danger); font-weight: 500; text-align: center; padding: 20px;">
            ${message}
        </div>
    `;
    resultDiv.style.display = 'block';
}
