
// import { tv } from 'tailwind-variants';

import { tv } from 'tailwind-variants'

export type ActionButtonProps = {
  disabled: boolean;
  variant?: 'primary' | 'secondary';
  text: string;
  callback?: (...args: unknown[]) => unknown;
}

const buttonStyle = tv({
  base: 'w-full p-2.5 text-base font-medium rounded transition-colors duration-300 ease-in-out cursor-pointer relative',
  variants: {
    variant: {
      primary: 'bg-primary text-widgetBg hover:bg-primary/80 disabled:bg-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed disabled:opacity-50',
      secondary: 'bg-secondary text-[#F5E6C3] border border-[#B89F7D] hover:bg-secondary/80 hover:border-primary'
    }
  }
})
// const buttonStyle = {}

const ActionButton = (props: ActionButtonProps) => {
  return (<button className={buttonStyle({ variant: props.variant || 'primary' })} disabled={props.disabled} onClick={props.callback}>
    {props.text}
  </button>)
}

export default ActionButton
