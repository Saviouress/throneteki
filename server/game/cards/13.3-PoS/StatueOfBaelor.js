const DrawCard = require('../../drawcard.js');

class StatueOfBaelor extends DrawCard {

	setupCardAbilities(ability) {
			this.action({
				title: 'Stand a character',
				target: {cardCondition: card => (card.controller === this.controller && card.getType() === 'character') || card.controller === this.controller && card.getType() === 'location'},
				cost: [ability.costs.discardPower(1, card => card.getType() === 'character' || card.getType() === 'location'),
						ability.costs.kneelSelf()
					],
				handler: context => {
					context.target.controller.standCard(context.target);
					this.game.addMessage('{0} kneels {1} and discards 1 power from {2} to stand {2}', context.player, this, context.target);
				}
			});
	}
}

StatueOfBaelor.code = '13058';

module.exports = StatueOfBaelor;
