# Blackjack Strategy Tool

A simple web-based tool to help you make optimal decisions while playing blackjack in Grand RP (a GTA V role-playing server). The tool uses basic blackjack strategy to recommend actions (Double, Split, Add, or Cancel) based on your hand and the dealer's upcard.

## Live Demo

Check out the live site here: [https://sumit961.github.io/BlackJack/](https://sumit961.github.io/BlackJack/)

## Features

- **Input Your Hand**: Enter your first two cards and the dealer's upcard.
- **Get Recommendations**: The tool suggests the best action (Double, Split, Add, or Cancel) based on basic blackjack strategy.
- **Add Cards**: After choosing to "Add" (hit), you can input additional cards to get updated recommendations.
- **Grand RP Terminology**: Uses the same action names as Grand RP blackjack (Double, Split, Add, Cancel).

## How to Use

1. Open the live site: [https://sumit961.github.io/BlackJack/](https://sumit961.github.io/BlackJack/)
2. Enter your first card (e.g., 2, A, J) in the "Your First Card" field.
3. Enter your second card (e.g., 6, K) in the "Your Second Card" field.
4. Enter the dealer's upcard (e.g., 7, A) in the "Dealer's Upcard" field.
5. Click "Get Action" to see the recommended action.
6. If the recommendation is "Add" and your total is less than 21, enter the new card you received in the "Additional Card" field and click "Add Another Card" to get the next action.
7. Repeat until you choose to "Cancel" (stand) or bust (total > 21).

## Example

- **Initial Hand**: 2 and 6 vs. Dealer's 7
  - Recommended Action: **Add**
- **Add a Card**: You add a 5 (new total: 13)
  - Recommended Action: **Add** (because 13 is too weak against a 7)
- **Add Another Card**: You add a 4 (new total: 17)
  - Recommended Action: **Cancel** (stand on 17)
