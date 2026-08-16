import { Component } from 'solid-js';
import { Icon } from 'solid-heroicons';
import { check, cube } from 'solid-heroicons/outline';
import { useMenu } from 'solid-repl/src/components/ui/Menu';
import { Button } from 'solid-repl/src/components/ui/Button';
import { css, cx } from 'styled-system/css';
import { SOLID_VERSION_OPTIONS } from '../solidVersion';

const headerButtonOnMobile = css({
  rounded: 'none',
  _active: { bg: 'gray.300' },
  _hover: { bg: 'gray.300', _dark: { color: 'black' } },
});

export const VersionDropdown: Component<{
  version: string;
  onChange: (version: string) => void;
  showOnMobile: boolean;
}> = (props) => {
  const label = () => {
    const option = SOLID_VERSION_OPTIONS.find((o) => o.value === props.version);
    if (option) return option.label;
    return props.version.includes('.') ? `v${props.version}` : props.version;
  };

  const menu = useMenu(
    () =>
      SOLID_VERSION_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label,
        icon: option.value === props.version ? check : undefined,
        onSelect: () => props.onChange(option.value),
      })),
    { positioning: { placement: 'bottom-end' } },
  );

  return (
    <>
      <Button
        {...menu.api().getTriggerProps()}
        type="button"
        class={cx(props.showOnMobile && headerButtonOnMobile)}
        title="Switch Solid version"
      >
        <Icon path={cube} class={css({ h: 6 })} />
        <span class={css({ fontSize: 'sm' })}>{label()}</span>
      </Button>
      <menu.Content />
    </>
  );
};
