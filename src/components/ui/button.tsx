import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';
import { Slot } from '@radix-ui/react-slot';

import { SexyBoarder } from '../sexy-boarder';

const buttonVariants = cva(
  'w-fit inline-flex items-center justify-center whitespace-nowrap text-sm rounded-md font-alt font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-black text-white hover:bg-black/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-black bg-white text-black hover:bg-gray-100',
        secondary: 'bg-white text-black border border-black hover:bg-gray-100',
        ghost: 'hover:bg-gray-100 text-black',
        link: 'text-black underline-offset-4 hover:underline',
        orange: 'bg-black text-white hover:bg-black/90',
        sexy: 'bg-black text-white hover:bg-black/90',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <WithSexyBorder variant={variant} className={cn('w-fit', className)}>
        <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
      </WithSexyBorder>
    );
  },
);
Button.displayName = 'Button';

export function WithSexyBorder({
  variant,
  className,
  children,
}: {
  variant: string | null | undefined;
  className?: string;
  children: React.ReactNode;
}) {
  if (variant === 'sexy') {
    return <SexyBoarder className={className}>{children}</SexyBoarder>;
  } else {
    return <>{children}</>;
  }
}

export { Button, buttonVariants };
