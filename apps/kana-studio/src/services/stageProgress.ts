import type {StoredCardData} from '../types/kana';
import type {LearningStage} from '../data/kanaData';

/** Being introduced is not the same as mastering or grading a Kana. */
export function wasKanaIntroduced(card:StoredCardData|undefined):boolean {
  return Boolean(card && (card.introducedAt || card.totalReviews>0 || card.card.state!==0));
}
export function nextStageCharacterIndex(
  stage:Pick<LearningStage,'kanaIds'>,
  cards:ReadonlyMap<string,StoredCardData>
):number {
  const index=stage.kanaIds.findIndex(id=>!wasKanaIntroduced(cards.get(id)));
  // A completed stage replays from the beginning without rewriting its history.
  return index===-1?0:index;
}
