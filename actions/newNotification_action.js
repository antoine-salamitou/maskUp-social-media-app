import {
NEW_MESSAGE_NOTIF,
MINUS_MESSAGE_NOTIF,
NB_PROFILE_NOTIF,
RESTART_MESSAGE_NOTIFICATION,
RESTART_PROFILE_NOTIFICATION
} from './types';

export const newMessageNotification = () => {
	console.log('f')
	return {
		type: NEW_MESSAGE_NOTIF
	};
};

export const minusMessageNotification = () => {
	console.log('e')
	return {
		type: MINUS_MESSAGE_NOTIF
	};
};

export const profileNotif = (nbProfileNotif) => {
	return {
		type: NB_PROFILE_NOTIF, payload: nbProfileNotif
	};
};

export const restartMessageNotifications = () => {
	return {
		type: RESTART_MESSAGE_NOTIFICATION
	};
};

export const restartProfileNotif = () => {
	return {
		type: RESTART_PROFILE_NOTIFICATION
	};
};
