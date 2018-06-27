from concurrent.futures import ThreadPoolExecutor, wait

class AsyncWrapper(object):

    def __init__(self, num_workers, num_jobs=None):
        self.num_workers = num_workers
        self._executor = ThreadPoolExecutor(max_workers=self.num_workers)
        self._futures = []

    def add_job_to_worker(self, worker_callback, **args):
        self._futures.append(self._executor.submit(worker_callback, **args))

    def get_job_results(self):
        job_results = []
        raise_error = False
        all_futures = wait(self._futures).done

        for x in all_futures:
            try:
                job_results.append((x.results()))
            except Exception as exc:
                print('Job ended with exception %s' % exc)
                raise_error = True 
            if raise_error:
                raise RuntimeError("One or more worker ended in Exception.")
            return job_results

            
        
