"use client";

import { LiveMap } from "@liveblocks/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DocumentHeader, DocumentHeaderSkeleton } from "@/components/Document";
import { TextEditor } from "@/components/TextEditor";
import { DocumentLayout } from "@/layouts/Document";
import { ErrorLayout } from "@/layouts/Error";
import { InitialDocumentProvider } from "@/lib/hooks";
import { RoomProvider } from "@liveblocks/react/suspense";
import { Document, ErrorData } from "@/types";

type Props = {
  initialDocument: Document | null;
  initialError: ErrorData | null;
};

export function TextDocumentView({ initialDocument, initialError }: Props) {
  const { id, error: queryError } = useParams<{ id: string; error: string }>();
  const [error, setError] = useState<ErrorData | null>(initialError);

  // If error object in params, retrieve it
  useEffect(() => {
    if (queryError) {
      setError(JSON.parse(decodeURIComponent(queryError as string)));
    }
  }, [queryError]);

  if (error) {
    return <ErrorLayout error={error} />;
  }

  if (!initialDocument) {
    return <DocumentLayout header={<DocumentHeaderSkeleton />} />;
  }

  return (
    <RoomProvider
      id={id as string}
      initialPresence={{ cursor: null }}
    >
      <InitialDocumentProvider initialDocument={initialDocument}>
        <DocumentLayout
          header={<DocumentHeader documentId={initialDocument.id} />}
        >
          <TextEditor />
        </DocumentLayout>
      </InitialDocumentProvider>
    </RoomProvider>
  );
}
