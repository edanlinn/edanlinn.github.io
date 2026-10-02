/* Three-role API compatibility; cosmic character UI and renderers removed. */
function avatarAppearance(){const role=gameState(quizState()).role;return {profession:{base:['mage','paladin','ranger'].includes(role)?role:'mage'}};}
function renderAvatarCustomizer(){}
function initAvatarCustomizer(){document.querySelector('#open-role-collection').insertAdjacentHTML('afterend','<button type="button" id="open-avatar-customizer" class="avatar-open">LOL 英雄與造型 →</button>');}
