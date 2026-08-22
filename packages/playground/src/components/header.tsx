import { Icon } from 'solid-heroicons';
import { Component, Show, createMemo, createSignal, createUniqueId, onCleanup } from 'solid-js';
import { bars_3, moon, sun, xCircle } from 'solid-heroicons/outline';
import * as popover from '@zag-js/popover';
import { useMachine, normalizeProps } from '@zag-js/solid';
import { ZoomDropdown } from './zoomDropdown';
import { VersionDropdown } from './versionDropdown';
import { ExampleSelect, ExampleVariantButton } from './exampleSelect';
import { useAppContext } from '../context';
import { Button, LinkButton } from 'solid-repl/src/components/ui/Button';
import { css, cx } from 'styled-system/css';
import type { ExampleVariant } from '../examples';

import logo from '../assets/logo.svg?url';

const headerStyles = css({
  position: 'sticky',
  top: 0,
  zIndex: 12,
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  p: 1,
  px: 2,
  fontSize: 'sm',
  bg: 'neutral.100',
  _dark: { bg: 'neutral.950' },
});

// The title is set in tracked-out uppercase, which is wide: at the desktop size
// the full name needs ~270px, more than a 375px header can spare next to the logo
// and the menu button. Rather than dropping a word — which just reads as cut off
// — the type tightens on a narrow screen so the whole name still fits, with the
// ellipsis left as a last resort below that.
//
// Two things this must not do again: `lineHeight: 0` (it once collapsed the two
// wrapped lines on top of each other, and clipped the text away entirely once
// `overflow: hidden` was added), and wrapping (`nowrap` keeps it to one line).
const titleStyles = css({
  lineHeight: 1.2,
  fontSize: { base: 'xs', md: 'sm' },
  letterSpacing: { base: 'wide', md: 'widest' },
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minW: 0,
});

const menuButtonOnMobile = css({
  rounded: 'none',
  justifyContent: 'flex-start',
  _active: { bg: 'gray.300' },
  _hover: { bg: 'gray.300', _dark: { color: 'black' } },
});

const desktopMenuList = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 2,
});

const mobileMenuPanel = css({
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: 'max-content',
  maxWidth: 'calc(100vw - 1rem)',
  borderWidth: '1px',
  borderColor: 'neutral.200',
  bg: 'white',
  rounded: 'lg',
  shadow: 'lg',
  _dark: { borderColor: 'neutral.700', bg: 'neutral.900' },
});

export const Header: Component<{
  solidVersion?: string;
  onSolidVersionChange?: (version: string) => void;
  exampleRule?: string;
  onExampleChange?: (rule: string) => void;
  exampleVariant?: ExampleVariant;
  onExampleVariantToggle?: () => void;
}> = (props) => {
  const mql = window.matchMedia('(max-width: 767px)');
  const [isMobile, setIsMobile] = createSignal(mql.matches);
  const onChange = () => setIsMobile(mql.matches);
  mql.addEventListener('change', onChange);
  onCleanup(() => mql.removeEventListener('change', onChange));

  const mobileMenu = useMachine(popover.machine, {
    id: createUniqueId(),
    portalled: false,
    positioning: { placement: 'bottom-end' },
  });
  const mobileApi = createMemo(() => popover.connect(mobileMenu, normalizeProps));

  return (
    <header class={headerStyles}>
      <img src={logo} alt="solid-js logo" class={css({ w: 8, flexShrink: 0 })} />
      <h1 class={titleStyles}>Solid Checker Playground</h1>

      <div class={css({ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2, minW: 0 })}>
        <Show
          when={isMobile()}
          fallback={
            <div class={desktopMenuList}>
              <HeaderMenuItems {...props} showOnMobile={false} />
            </div>
          }
        >
          <Show when={mobileApi().open}>
            <div {...mobileApi().getPositionerProps()}>
              <div {...mobileApi().getContentProps()} class={mobileMenuPanel}>
                <HeaderMenuItems {...props} showOnMobile />
              </div>
            </div>
          </Show>
          <Button
            {...mobileApi().getTriggerProps()}
            type="button"
            class={cx(mobileApi().open && css({ borderWidth: '1px', borderColor: 'white' }))}
            variant="ghost"
            title="Mobile Menu Button"
          >
            <Show when={mobileApi().open} fallback={<Icon path={bars_3} class={css({ h: 6, w: 6 })} />}>
              <Icon path={xCircle} class={css({ h: '22px', w: '22px' })} />
            </Show>
            <span class={css({ srOnly: true })}>Show menu</span>
          </Button>
        </Show>
      </div>
    </header>
  );
};

const HeaderMenuItems: Component<{
  showOnMobile: boolean;
  solidVersion?: string;
  onSolidVersionChange?: (version: string) => void;
  exampleRule?: string;
  onExampleChange?: (rule: string) => void;
  exampleVariant?: ExampleVariant;
  onExampleVariantToggle?: () => void;
}> = (props) => {
  const context = useAppContext()!;
  const mobileBtn = () => (props.showOnMobile ? menuButtonOnMobile : '');
  return (
    <>
      <Show when={props.onExampleChange}>
        {(onChange) => (
          <ExampleSelect
            version={props.solidVersion}
            rule={props.exampleRule ?? ''}
            onChange={(rule) => onChange()(rule)}
            showOnMobile={props.showOnMobile}
          />
        )}
      </Show>

      <Show when={props.exampleRule && props.onExampleVariantToggle}>
        <ExampleVariantButton
          variant={props.exampleVariant ?? 'incorrect'}
          onToggle={() => props.onExampleVariantToggle!()}
          showOnMobile={props.showOnMobile}
        />
      </Show>

      <Show when={props.onSolidVersionChange}>
        {(onChange) => (
          <VersionDropdown
            version={props.solidVersion ?? ''}
            onChange={(v) => onChange()(v)}
            showOnMobile={props.showOnMobile}
          />
        )}
      </Show>

      <ZoomDropdown showMenu={props.showOnMobile} />

      <Button onClick={context.toggleDark} class={mobileBtn()} title="Toggle dark mode">
        <Show when={context.dark()} fallback={<Icon path={moon} class={css({ h: 6 })} />}>
          <Icon path={sun} class={css({ h: 6 })} />
        </Show>
        <span class={css({ fontSize: 'sm', md: { srOnly: true } })}>{context.dark() ? 'Light' : 'Dark'} mode</span>
      </Button>

      <LinkButton
        href="https://github.com/yumemi-thomas/solid-checker"
        target="_blank"
        class={cx(mobileBtn(), css({ cursor: 'alias' }))}
        title="solid-checker on GitHub"
      >
        <Icon
          viewBox="0 0 96 96"
          class={css({ h: 6 })}
          path={{
            path: (
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
              />
            ),
            outline: false,
            mini: false,
          }}
        />
        <span class={css({ fontSize: 'sm', md: { srOnly: true } })}>GitHub</span>
      </LinkButton>
    </>
  );
};
