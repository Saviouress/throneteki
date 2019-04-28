const DrawCard = require('../../drawcard.js');

class GhostOfHighHeart extends DrawCard {
	setupCardAbilities(ability) {
		this.persistentEffect({
			condition: () => !this.controller.anyCardsInPlay(card => card.getType() === 'character' && card.isLoyal()),
            effect: ability.effects.modifyStrength(1)
		});
		this.action({
			title: 'Look at a player\'s hand',
			phase: 'challenge',
			choices: {
				'Opponent': () => {
					chooseOpponent: opponent => opponent.hand.length !== 0,
					handler: context => {
						this.game.addMessage('{0} plays {1} to look at {2}\'s hand', context.player, this, context.opponent);
						this.game.promptForSelect(context.player, {
							activePromptTitle: 'Select a card',
							source: this,
							revealTargets: true,
							cardCondition: card => card.location === 'hand' && card.controller === context.opponent,
							onSelect: (player, card) => this.onCardSelected(player, card)
						});
					}
					onCardSelected(player, card) {
						let otherPlayer = card.controller;
						otherPlayer.discardCard(card);
						if(this.controller.canDraw()) {
							this.controller.drawCardsToHand(1);
						}	
						this.game.addMessage('{0} then uses {1} to discard {2} from {3}\'s hand', player, this, card, otherPlayer);
						return true;
					}
				},
				'Self': () => {
					cost: [
						ability.costs.kneelSelf(),
						ability.costs.discardFromHand()
					],
					handler: context => {
						context.player.drawCardsToHand(1);
						this.game.addMessage('{0} kneels {1} and discards {2} from their hand to draw 1 card',
						context.player, this, context.costs.discardFromHand);
					}
				}
			}
		}})

}

GhostOfHighHeart.code = '13037';

module.exports = GhostOfHighHeart;
