
# Feature Development Workflow

## PMUX

1. [Lucia] Tasks requiring PMUX attention will be in the “In refinement” section of the current Asana sprint.
    - Tasks will be added 3 - 4 weeks in advance to Dev phase (1-2 weeks for PMUX, 1-2 weeks for Pre-Dev)
2. [Lucia] Ensure guidelines and specs for each page / FR is included in the Asana ticket.
3. [UX] Work through “In refinement” Asana tasks ensuring that they are meeting the specs + fully brushed up from a UX / UI perspective.
Include edge case scenarios where relevant.
4. [UX] When mocks are complete, do a review session of the design with Lucia. After this, present in weekly PMUX meeting and resolve any questions.
5. [UX] When everything is finalized, move the ticket to Ready for dev.

## Pre-Dev
Timeline: Should start 1-2 weeks (depending on size) before Dev phase to allow time for PMUX follow ups and dependency resolutions.

1. [Eng Owner] Before starting to work on a task or feature, schedule a “hand-off” sync with UX and Lucia. For features which will require backend changes, include someone from Cryptosense backend team (ask Bertrand who is the right POC for the feature). Some things to cover:
    - Align on the specs that are being outlined
    - Consider any edge cases not be already specified in the mocks (e.g. how does the item look with empty data)
    - Raise any “hard to implement” aspects and come up with alternatives if appropriate.
2. [Eng Owner] Commit to a date for which the feature will be ready for delivery and set it on Asana.
3. [Eng Owner] Flag any dependencies.
    - Ensure they are added on the `Control Center` project under the `Dependencies` header and on the `Cryptosense` project with the `ControlCenter` tag.

## Dev

1. [Eng Owner] [Create a Feature Flag](feature-flags.md) for your changes.
2. [Eng Owner] Ensure the feature is code complete and includes thorough testing.
3. [Eng Owner] Run a bug bash, see [guidelines](running-a-bug-bash.md).
4. [Eng Owner] Resolve all P0 + P1 (blocking) bugs.

## Release

WIP - TpM working on release guidelines.

## Post-release
- [Eng Owner] Clean up feature flag after 1 month of being in prod, please create an Asana ticket with target for tracking.
- [Eng Owner] Follow up on any bugs found regarding this feature.
