// Components
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import {
//   Field,
//   FieldError,
//   FieldGroup,
//   FieldLabel,
// } from "@/components/ui/field";
// import {
//   InputGroup,
//   InputGroupAddon,
//   InputGroupText,
//   InputGroupTextarea,
// } from "@/components/ui/input-group";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Border } from "@/components/border";
import { ArrowBigLeftIcon } from "lucide-react";
// import { toast } from "sonner";
// Sections
// import { ContributorEditSection } from "./-components/contributor";
// import { EdgeEditSection } from "./-components/edge";
// Helpers
import { makeSourceKey } from "@/lib/versioningHelpers";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
// import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
// Stores
import { useSourceStore } from "@/store/sourceStore";
// Types & Schemas
// import {
//   sourceSchema,
//   type Contributor,
//   type EdgeSkill,
//   type Source,
// } from "@/types/source";
import type { Id, Version } from "@/types/refrence";

export const Route = createFileRoute("/sources/$sourceId/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sourceId } = Route.useParams();
  const sourceIdTyped = sourceId as Id;
  const sourceVersion = "1.0.0" as Version;

  const { loadSource, getSourceByKey, isLoading } = useSourceStore();
  const sourceKey = makeSourceKey(sourceIdTyped, sourceVersion);
  const source = getSourceByKey(sourceKey);

  // save functions
  // const onSave = () => {
  //   return () => {
  //     // Save logic here
  //     console.log("Save clicked");
  //   };
  // };

  useEffect(() => {
    if (!source) {
      loadSource(sourceIdTyped, sourceVersion);
    }
  }, [sourceIdTyped, sourceVersion, loadSource, source]);

  if (isLoading) {
    return <div>Loading source...</div>;
  }

  if (!source) {
    return <div>Source not found</div>;
  }
  return (
    <Border className="flex justify-center items-center select-none">
      <Link to="/sources">
        <Button
          size="icon"
          className="fixed left-5 top-5 z-50"
          aria-label="Back to previous page"
        >
          <ArrowBigLeftIcon />
        </Button>
      </Link>
      <h1 className="text-9xl">W.I.P</h1>
    </Border>
  );

  // return (
  //   <>
  //     <header className="p-5 lg:hidden flex-col gap-2 flex mb-[-100px]">
  //       <div className="flex gap-4">
  //         <h1>Edit for {sourceId}</h1>
  //         <Badge>{source.version}</Badge>
  //         <AlertDialog>
  //           <AlertDialogTrigger asChild>
  //             <Button variant="outline" className="ml-auto">
  //               Go Back
  //             </Button>
  //           </AlertDialogTrigger>
  //           <AlertDialogContent className="min-w-[60vw]">
  //             <AlertDialogHeader>
  //               <AlertDialogTitle>Go Back</AlertDialogTitle>
  //             </AlertDialogHeader>
  //             <AlertDialogDescription className="space-y-2">
  //               Any unsaved changes will be lost.
  //             </AlertDialogDescription>
  //             <AlertDialogFooter>
  //               <AlertDialogCancel>Cancel</AlertDialogCancel>
  //               <AlertDialogAction asChild>
  //                 <Link to="/sources">Go Back</Link>
  //               </AlertDialogAction>
  //             </AlertDialogFooter>
  //           </AlertDialogContent>
  //         </AlertDialog>
  //         <AlertDialog>
  //           <AlertDialogTrigger asChild>
  //             <Button variant="outline" className="ml-auto">
  //               Save Changes
  //             </Button>
  //           </AlertDialogTrigger>
  //           <AlertDialogContent className="min-w-[60vw]">
  //             <AlertDialogHeader>
  //               <AlertDialogTitle>Save Changes</AlertDialogTitle>
  //             </AlertDialogHeader>
  //             <AlertDialogDescription className="space-y-2">
  //               <SaveScreen source={source} />
  //               <div>
  //                 Are you sure you want to save the changes to this source?
  //                 <br />
  //                 This will make a draft version of the source.
  //               </div>
  //             </AlertDialogDescription>
  //             <AlertDialogFooter>
  //               <AlertDialogCancel>Cancel</AlertDialogCancel>
  //               <AlertDialogAction onClick={onSave()}>Save</AlertDialogAction>
  //             </AlertDialogFooter>
  //           </AlertDialogContent>
  //         </AlertDialog>
  //       </div>
  //       <p>{source.description}</p>
  //     </header>
  //     <Border>
  //       <header className="p-5 lg:flex flex-col gap-2 hidden ">
  //         <div className="flex gap-4">
  //           <h1>Edit for {sourceId}</h1>
  //           <Badge>{source.version}</Badge>
  //           <div className="space-x-4 ml-auto">
  //             <AlertDialog>
  //               <AlertDialogTrigger asChild>
  //                 <Button variant="outline">Go Back</Button>
  //               </AlertDialogTrigger>
  //               <AlertDialogContent>
  //                 <AlertDialogHeader>
  //                   <AlertDialogTitle>Go Back</AlertDialogTitle>
  //                 </AlertDialogHeader>
  //                 <AlertDialogDescription>
  //                   Any unsaved changes will be lost.
  //                 </AlertDialogDescription>
  //                 <AlertDialogFooter>
  //                   <AlertDialogCancel>Cancel</AlertDialogCancel>
  //                   <AlertDialogAction asChild>
  //                     <Link to="/sources">Go Back</Link>
  //                   </AlertDialogAction>
  //                 </AlertDialogFooter>
  //               </AlertDialogContent>
  //             </AlertDialog>
  //             <AlertDialog>
  //               <AlertDialogTrigger asChild>
  //                 <Button variant="outline">Save Changes</Button>
  //               </AlertDialogTrigger>
  //               <AlertDialogContent className="min-w-[60vw]">
  //                 <AlertDialogHeader>
  //                   <AlertDialogTitle>Save Changes</AlertDialogTitle>
  //                 </AlertDialogHeader>
  //                 <AlertDialogDescription className="space-y-2">
  //                   <SaveScreen source={source} />
  //                   <div>
  //                     {/* Check the current soruce store object and the saved
  //               one if it's the same  say 'No changes made yet'*/}
  //                     Are you sure you want to save the changes to this source?
  //                     <br />
  //                     This will make a draft version of the source.
  //                   </div>
  //                 </AlertDialogDescription>
  //                 <AlertDialogFooter>
  //                   <AlertDialogCancel>Cancel</AlertDialogCancel>
  //                   <AlertDialogAction onClick={onSave()}>
  //                     Save
  //                   </AlertDialogAction>
  //                 </AlertDialogFooter>
  //               </AlertDialogContent>
  //             </AlertDialog>
  //           </div>
  //         </div>
  //         <p>{source.description}</p>
  //       </header>
  //       <ScrollArea className="h-[600px] max-h-[calc(100vh-20rem)] w-full">
  //         <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
  //           {source.contributors.length >= 0 && (
  //             <ContributorEditSection
  //               sourceKey={sourceKey}
  //               contributors={source.contributors as Contributor[]}
  //             />
  //           )}
  //           {source.data.edges && source.data.edges.length >= 0 && (
  //             <EdgeEditSection
  //               sourceKey={sourceKey}
  //               edges={source.data.edges as EdgeSkill[]}
  //             />
  //           )}
  //           {source.data.skills && source.data.skills.length >= 0 && (
  //             <div>skills section placeholder</div>
  //           )}
  //           {source.data.tags && source.data.tags.length >= 0 && (
  //             <div>tags section placeholder</div>
  //           )}
  //           {source.data.items && source.data.items.length >= 0 && (
  //             <div>items section placeholder</div>
  //           )}
  //         </div>
  //       </ScrollArea>
  //     </Border>
  //   </>
  // );
}

// function SaveScreen({ source }: { source: Source }) {
//   // option to edit other metadata fields like name and descritption
//   // Option to save as release prompt the user to put in a version number

//   const form = useForm({
//     defaultValues: {
//       id:          source.id,
//       name:        source.name || "",
//       description: source.description || "",
//       url:         source.url || "",
//       license:     source.license || "",
//       language:    source.language || "en-GB",
//     },
//     validators: {
//       // @ts-expect-error - Zod schema has optional fields, but form state has description as required array
//       onSubmit: sourceSchema,
//     },
//     onSubmit: async ({ value }) => {
//       toast.success("Saved successfully");
//     },
//   });
//   return (
//     <>
//       <p>Change information about the source here:</p>
//       <form
//         id="edge-edit-form"
//         onSubmit={(e) => {
//           e.preventDefault();
//           form.handleSubmit();
//         }}
//       >
//         <FieldGroup>
//           <div className="grid md:grid-cols-2 gap-4">
//             <form.Field
//               name="name"
//               children={(field) => {
//                 const isInvalid =
//                   field.state.meta.isTouched && !field.state.meta.isValid;
//                 return (
//                   <Field data-invalid={isInvalid}>
//                     <FieldLabel htmlFor={field.name}>Name</FieldLabel>
//                     <Input
//                       id={field.name}
//                       name={field.name}
//                       value={field.state.value}
//                       onBlur={field.handleBlur}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                       aria-invalid={isInvalid}
//                       placeholder="Name for the Source"
//                       autoComplete="off"
//                     />
//                     {isInvalid && (
//                       <FieldError errors={field.state.meta.errors} />
//                     )}
//                   </Field>
//                 );
//               }}
//             />
//             <form.Field
//               name="url"
//               children={(field) => {
//                 const isInvalid =
//                   field.state.meta.isTouched && !field.state.meta.isValid;
//                 return (
//                   <Field data-invalid={isInvalid}>
//                     <FieldLabel htmlFor={field.name}>URL</FieldLabel>
//                     <Input
//                       id={field.name}
//                       name={field.name}
//                       value={field.state.value}
//                       onBlur={field.handleBlur}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                       aria-invalid={isInvalid}
//                       placeholder="An URL to the Origin or Download"
//                       autoComplete="off"
//                     />
//                     {isInvalid && (
//                       <FieldError errors={field.state.meta.errors} />
//                     )}
//                   </Field>
//                 );
//               }}
//             />
//             <form.Field
//               name="license"
//               children={(field) => {
//                 const isInvalid =
//                   field.state.meta.isTouched && !field.state.meta.isValid;
//                 return (
//                   <Field data-invalid={isInvalid}>
//                     <FieldLabel htmlFor={field.name}>URL</FieldLabel>
//                     <Input
//                       id={field.name}
//                       name={field.name}
//                       value={field.state.value}
//                       onBlur={field.handleBlur}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                       aria-invalid={isInvalid}
//                       placeholder="License, MIT, CC-BY, etc."
//                       autoComplete="off"
//                     />
//                     {isInvalid && (
//                       <FieldError errors={field.state.meta.errors} />
//                     )}
//                   </Field>
//                 );
//               }}
//             />
//             <form.Field
//               name="language"
//               children={(field) => {
//                 const isInvalid =
//                   field.state.meta.isTouched && !field.state.meta.isValid;
//                 return (
//                   <Field data-invalid={isInvalid}>
//                     <FieldLabel htmlFor={field.name}>Language</FieldLabel>
//                     <Input
//                       id={field.name}
//                       name={field.name}
//                       value={field.state.value}
//                       onBlur={field.handleBlur}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                       aria-invalid={isInvalid}
//                       placeholder="Language BCP-47 code, e.g. en-GB"
//                       autoComplete="off"
//                     />
//                     {isInvalid && (
//                       <FieldError errors={field.state.meta.errors} />
//                     )}
//                   </Field>
//                 );
//               }}
//             />
//           </div>
//           <form.Field
//             name="description"
//             children={(field) => {
//               const isInvalid =
//                 field.state.meta.isTouched && !field.state.meta.isValid;
//               return (
//                 <Field data-invalid={isInvalid}>
//                   <FieldLabel htmlFor={field.name}>Description</FieldLabel>
//                   <InputGroup>
//                     <InputGroupTextarea
//                       id={field.name}
//                       name={field.name}
//                       value={field.state.value}
//                       onBlur={field.handleBlur}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                       placeholder="Short Description about the source and what it adds"
//                       rows={5}
//                       className="min-h-12 resize-none"
//                       aria-invalid={isInvalid}
//                     />
//                     <InputGroupAddon align="block-end">
//                       <InputGroupText className="tabular-nums">
//                         {field.state.value.length}/200 characters
//                       </InputGroupText>
//                     </InputGroupAddon>
//                   </InputGroup>
//                   {isInvalid && <FieldError errors={field.state.meta.errors} />}
//                 </Field>
//               );
//             }}
//           />
//         </FieldGroup>
//       </form>
//       <Field orientation="horizontal">
//         <Button type="submit" form="edge-edit-form">
//           Submit
//         </Button>
//       </Field>
//     </>
//   );
// }
