import { Settings as Gear } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useSettingsStore } from "@/store/settingsStore";
import {
  type SaveFrequency,
  SaveFrequencyConst,
  type SaveIndicator,
  type Settings,
  defaultSettings,
  saveIndicatorSchema,
  settingsSchema,
} from "@/types/settings";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";

export default function Settings() {
  const { settings, setSettings } = useSettingsStore();

  const form = useForm({
    defaultValues: settings,
    validators:    {
      onSubmit: settingsSchema,
    },
    onSubmit: ({ value }) => {
      setSettings(value);
      toast.success("Settings saved successfully");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="fixed right-5 top-5 z-50"
          aria-label="Open settings"
        >
          <Gear />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Adjust your sheet preferences below.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <FieldGroup>
            <form.Field
              name="saveFrequency"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Save Frequency</FieldLabel>
                    <FieldDescription>
                      <strong>Default</strong> saves every 2 seconds with no
                      interaction, <strong>Half</strong>, 4s, <strong>Quarter</strong> 8s.
                    </FieldDescription>
                    <Select
                      value={String(field.state.value)}
                      onValueChange={(value) =>
                        field.handleChange(Number(value) as SaveFrequency)
                      }
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(SaveFrequencyConst).map(
                          ([label, value]) => (
                            <SelectItem key={value} value={String(value)}>
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="saveIndicator"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Save Indicator</FieldLabel>
                    <FieldDescription>
                      <strong>Default</strong> shows the full toast, <strong>Small</strong> just
                      the icon, <strong>None</strong> still saves but does not
                      show it.
                    </FieldDescription>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as SaveIndicator)
                      }
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {saveIndicatorSchema.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset(defaultSettings);
                setSettings(defaultSettings);
                toast.success("Settings reset successfully");
              }}
            >
              Reset to default
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
