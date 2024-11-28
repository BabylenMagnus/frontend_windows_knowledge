"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const storages = [
  {
    value: "personal",
    label: "Личное хранилище",
  },
  {
    value: "work",
    label: "Рабочие документы",
  },
  {
    value: "shared",
    label: "Общие документы",
  },
]

interface StorageSelectorProps {
  onStorageChange: (value: string) => void
}

export function StorageSelector({ onStorageChange }: StorageSelectorProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? storages.find((storage) => storage.value === value)?.label
            : "Выберите хранилище..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Поиск хранилища..." />
          <CommandEmpty>Хранилище не найдено.</CommandEmpty>
          <CommandGroup>
            {storages.map((storage) => (
              <CommandItem
                key={storage.value}
                value={storage.value}
                onSelect={(currentValue) => {
                  setValue(currentValue)
                  onStorageChange(currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === storage.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {storage.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
