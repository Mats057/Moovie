import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const ErrorDialog = ({ error, title }) => {
    console.log(error)
  return (
    <AlertDialog defaultOpen={true}>
      <AlertDialogContent className='bg-red-950 border-red-600'>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">{title + ' - (' + error.status+')'}</AlertDialogTitle>
          <AlertDialogDescription className="text-red-600">{error.message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={reloadPage} className="bg-black/30 hover:bg-black/40">
            Tentar Novamente
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const reloadPage = () => {
  window.location.reload();
};