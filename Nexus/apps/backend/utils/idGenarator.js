
import { nanoid } from "nanoid";

export const generateUserId = () => `usr_${nanoid(10)}`
export const generateTaskId = () => `tsk_${nanoid(12)}`
export const generateNotificationId = () => `ntf_${nanoid(8)}`