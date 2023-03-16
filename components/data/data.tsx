"use client"

import {Controller, FormProvider, useForm, useFormContext} from 'react-hook-form';

type Input = {
    adapter: string;
    data: string;
};

function InputItem({label, children, errors}: { label: string, children: any, errors: any }) {
    return (
        <div className='flex justify-between items-center'>
            <div>
                <label className='text-stone-800'>{label}</label>
                <div className='text-red-500'>
                    {errors && <div>This field is required</div>}
                </div>
            </div>
            <div className=''>{children}</div>
        </div>
    )
}

interface DaisyInputProps {
    name: string;
    label: string;
    tip: string;
    placeholder: string;
}

function DaisyInput(props: DaisyInputProps) {
    const { name, label, tip, placeholder } = props;
    const { control, formState: { errors } } = useFormContext();

    return (
        <>
            <label className="label">
                <span className={label}>{tip}</span>
            </label>
            <Controller
                name={name}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <label className="input-group">
                        <span>{label}</span>
                        <input {...field} type="text" placeholder={placeholder} className="input input-bordered w-full" />
                    </label>
                )}
            />
            {errors[name] && <span>This field is required</span>}
        </>
    );
}

function DataForm({onSubmit}: { onSubmit: any }) {
    const methods = useForm();

    const onSubmitHandler = (data: any) => {
        onSubmit(data.adapter, data.data);
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmitHandler)} className='flex flex-col gap-6'>
                <div className='form-control'>
                    <DaisyInput
                        name={'adapter'}
                        label={'Adapter'}
                        tip={'data adapter name'}
                        placeholder={'e.g. "CSVAdapter"'}
                    />
                    <DaisyInput
                        name={'data'}
                        label={'data'}
                        tip={'data path'}
                        placeholder={'e.g. "data/AAPL.csv"'}
                    />
                </div>
                <button type="submit" className='btn btn-secondary w-full'>Load Data</button>
            </form>
        </FormProvider>
    );
}

export default DataForm;