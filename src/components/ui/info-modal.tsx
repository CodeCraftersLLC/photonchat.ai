'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';

interface InfoModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ title, description, isOpen, onClose }: InfoModalProps) {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className='fixed inset-0 z-50 bg-black/30 dark:bg-black/50' />
        <DialogPrimitive.Content className='fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg focus:outline-none dark:bg-zinc-900'>
          <DialogPrimitive.Title className='text-lg font-semibold text-zinc-900 dark:text-zinc-50'>
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className='mt-2 text-sm text-zinc-500 dark:text-zinc-400'>
            {description}
          </DialogPrimitive.Description>
          <div className='mt-6 flex justify-end'>
            <DialogPrimitive.Close className='rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-900'>
              Close
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
