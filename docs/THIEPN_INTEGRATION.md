# THIEPN Integration

Japanese must integrate with the existing THIEPN platform rather than creating a parallel account system.

Current ecosystem contracts observed from `thiepn/account` and `thiepn/core`:

- Supabase Auth `auth.users.id` is the canonical THIEPN AccountId.
- Account owns the user-facing identity/profile/security/connected-app control plane.
- Core owns backend namespaces and infrastructure ownership.
- Account app connections/grants are control-plane state and do not replace data-path authorization.
- Product frontends should keep direct backend details behind an application adapter/service boundary.

Japanese integration target:

- Account app slug: `japanese`
- Core app ID / namespace target: `japanese`
- Japanese local state is partitioned by canonical AccountId.
- The app must not use email as an ownership key.
- Production auth state must be verified by the trusted Account/Auth boundary, not by trusting local cached state alone.

Actual registry mutations belong to the THIEPN Account/Core deployment work and are not silently performed from this repository.
