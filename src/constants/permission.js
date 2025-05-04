import { ROLES } from "./roles.js";

export const PERMISSIONS = {
  [ROLES.ADMIN]: [
    "create_user",
    "edit_user",
    "view_logs",
    "override_referral",
    "manage_config",
    "resolve_disputes",
    "create_admin_referral",
  ],
  [ROLES.HOST]: [
    "create_event",
    "manage_event",
    "approve_address",
    "mark_no_show",
    "handle_buy_in_requests",
    "invite_host",
    "invite_player",
    "invite_dealer",
  ],
  [ROLES.DEALER]: [
    "post_availability",
    "get_hired",
    "invite_host",
    "invite_player",
  ],
  [ROLES.PLAYER]: [
    "apply_event",
    "receive_base_buyin",
    "request_extra_buyin",
    "rate_host",
    "invite_player",
  ],
  [ROLES.AUTHOR]: ["create_content", "manage_feed_ads"],
};

export const INVITE_LIMITS = {
  [ROLES.PLAYER]: { [ROLES.PLAYER]: 3 },
  [ROLES.HOST]: { [ROLES.PLAYER]: 10, [ROLES.HOST]: 1 },
  [ROLES.DEALER]: { [ROLES.PLAYER]: 10, [ROLES.HOST]: 3 },
  [ROLES.ADMIN]: {
    [ROLES.PLAYER]: Infinity,
    [ROLES.HOST]: Infinity,
    [ROLES.DEALER]: Infinity,
    [ROLES.ADMIN]: Infinity,
  },
};
