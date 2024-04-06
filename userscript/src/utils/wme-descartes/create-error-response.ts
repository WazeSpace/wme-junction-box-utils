type ErrorLevel = 'WARNING' | 'ERROR';
type ErrorEntry = {
  code: number | string;
  details?: string;
  suggestion?: string;
  geometry?: {
    coordinates: number[];
    type: 'Point';
  };
  objects?: Array<{
    id: number;
    objectType: string;
  }>;
};

export function createDescratesErrorResponse(
  url: string,
  errorLevel: ErrorLevel,
  errorList: ErrorEntry[],
): Response {
  const errorData = {
    errorLevel,
    errorList,
  };

  const response = new Response(JSON.stringify(errorData), {
    status: 403,
    statusText: 'Forbidden',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  Object.defineProperty(response, 'url', { value: url });
  return response;
}
