"use client"

import {Controller, FormProvider, useForm, useFormContext} from 'react-hook-form';
import {useEffect, useState} from "react";
import axios from "axios";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import {AiFillPlayCircle, AiFillStepBackward, AiFillStepForward, AiOutlinePause} from "react-icons/all";

interface DaisyInputProps {
    name: string;
    label: string;
    tip: string;
    placeholder: string;
    required: boolean;
    type: string;
    selectOptions?: string[];
}

function DaisyInput(props: DaisyInputProps) {
    const {name, label, tip, placeholder, required} = props;
    const {control, formState: {errors}} = useFormContext();

    let controllerElement = (
        <Controller
            name={name}
            control={control}
            rules={{required: required}}
            render={({field}) => (
                <label className="input-group">
                    <span>{label}</span>
                    <input {...field}
                           type="text"
                           placeholder={placeholder}
                           className="input input-bordered w-full"
                    />
                </label>
            )}
        />
    )
    if (props.type === 'select') {
        controllerElement = (
            <Controller
                name={name}
                control={control}
                rules={{required: true}}
                render={({field}) => (
                    <label className="input-group flex">
                        <span>{label}</span>
                        <select {...field} className="select select-bordered flex-grow">
                            <option value="">Select an option</option>
                            {props.selectOptions?.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </label>
                )}
            />
        )
    }

    return (
        <>
            <label className="label">
                <span className={label}>{tip}</span>
            </label>
            {controllerElement}
            {errors[name] && <span className='text-error'>This field is required</span>}
        </>
    );
}

function DataForm({onSubmit}: { onSubmit: any }) {
    const methods = useForm();
    const { watch } = methods;
    const [adapterOptions, setAdapterOptions] = useState([]);
    const [dataResolution, setDataResolution] = useState(5);
    const [togglePlay, setTogglePlay] = useState(false);

    const onSubmitHandler = (data: any) => {
        const start = data.start === '' ? null : data.start;
        const end = data.end === '' ? null : data.end;
        onSubmit(data.adapter, data.data, start, end, methods);
    };

    const onForwardHandler = () => {
        const currentEndValue = methods.getValues('end');
        const newEndValue = Number(currentEndValue) + Number(dataResolution * 1000 * 60);
        methods.setValue('end', Number(newEndValue));
        methods.handleSubmit(onSubmitHandler)();
    }

    const onBackwardsHandler = () => {
        const currentStartValue = methods.getValues('end');
        const newEndValue = Number(currentStartValue) - Number(dataResolution * 1000 * 60);
        methods.setValue('end', Number(newEndValue));
        methods.handleSubmit(onSubmitHandler)();
    }

    useEffect(() => {
        if (togglePlay) {
            const timer = setInterval(() => {
                onForwardHandler();
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [togglePlay]);

    useEffect(() => {
        const url = `${process.env.NEXT_PUBLIC_HOST}/api/v1/data/adapters`
        axios.get(url).then(res => {
            setAdapterOptions(res.data);
        }).catch(err => {
            console.log(err);
        })
    }, []);

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmitHandler)}
                className='flex flex-col gap-6'
            >
                <div className='form-control'>
                    <DaisyInput
                        required={true}
                        name={'adapter'}
                        label={'Adapter'}
                        tip={'data adapter name'}
                        placeholder={'e.g. "CSVAdapter"'}
                        type={'select'}
                        selectOptions={adapterOptions}
                    />
                    <DaisyInput
                        required={true}
                        name={'data'}
                        label={'data'}
                        tip={'data path'}
                        placeholder={'e.g. "tests/data/AAPL.csv"'}
                        type={'string'}
                    />
                    <DaisyInput
                        required={false}
                        name={'start'}
                        label={'start'}
                        tip={'start time in ms (optional)'}
                        placeholder={''}
                        type={'number'}
                    />
                    <DaisyInput
                        required={false}
                        name={'end'}
                        label={'end'}
                        tip={'end time in ms (optional)'}
                        placeholder={''}
                        type={'number'}
                    />
                </div>
                <button type="submit" className='btn btn-secondary w-full'>Load Data</button>
            </form>
            <div className='flex gap-2 pt-2 items-center justify-end'>
                <div className='btn btn-accent' onClick={() => {onBackwardsHandler()}}><AiFillStepBackward/></div>
                <div className='btn btn-accent' onClick={() => {onForwardHandler()}}><AiFillStepForward/></div>
                <div className={'btn ' + (togglePlay ? 'btn-error' : 'btn-success')} onClick={() => setTogglePlay(!togglePlay)}>
                    {togglePlay ? <AiOutlinePause/> : <AiFillPlayCircle/>}
                </div>
            </div>

        </FormProvider>
    );
}

export default DataForm;