const later = (delay: number, task: 'resolve' | 'reject' = 'resolve') =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            if (task === 'resolve') resolve(undefined);
            else reject();
        }, delay);
    });

export default { later };
