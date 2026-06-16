import { WmeSDK } from "wme-sdk-typings";

export async function doAsyncMultipleActions<T>(
  wmeSdk: WmeSDK,
  cb: () => Promise<T>,
  description: string,
) {
  try {
    (wmeSdk.Editing as any).beginTransaction();
    const res = await cb();
    (wmeSdk.Editing as any).commitTransaction(description);
    return res;
  } catch (error) {
    (wmeSdk.Editing as any).cancelTransaction();
    throw error;
  }
}
