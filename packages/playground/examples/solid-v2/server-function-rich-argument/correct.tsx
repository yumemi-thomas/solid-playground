// Importing the `rich-args` entry and calling `enableRichArguments()` once at
// client startup installs the codec's write half, and every rich argument then
// travels faithfully — project-wide, so the rule goes silent everywhere.
//
// The other fix, when the ~5 KB codec is not wanted, is to convert at the call
// site instead: `when.toISOString()`, `Array.from(tags)`, plain objects and
// arrays of finite primitives.
import { enableRichArguments } from '@solidjs/web/server-functions/rich-args';

enableRichArguments();

export async function saveEvent(when: Date, tags: Set<string>) {
  'use server';
  return { when, tags };
}

export function SaveButton() {
  return (
    <button
      onClick={async () => {
        await saveEvent(new Date(), new Set(['launch']));
      }}
    >
      Save
    </button>
  );
}
