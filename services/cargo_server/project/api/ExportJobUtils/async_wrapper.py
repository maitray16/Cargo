from concurrent.futures import ProcessPoolExecutor, wait
import pandas as pd


class AsyncWrapper(object):
    def __init__(self, num_workers, num_jobs=None):
        self.num_workers = num_workers
        self._executor = ProcessPoolExecutor(max_workers=self.num_workers)
        self._futures = []

    def add_job_to_worker(self, worker_callback, **args):
        self._futures.append(self._executor.submit(worker_callback, **args))

    def get_job_results(self):
        self._job_results = pd.DataFrame()
        raise_error = False
        all_futures = wait(self._futures).done

        for x in all_futures:
            try:
                self._job_results = self._job_results.append((x.result()))
            except Exception as exc:
                print('Job ended with exception %s' % exc)
                raise_error = True
        if raise_error:
            raise RuntimeError("One or more worker ended in Exception.")
        return self._job_results
