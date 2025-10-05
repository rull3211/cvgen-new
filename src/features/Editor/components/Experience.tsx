
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import styles from "../editor.module.scss"
import LabelWrapper from './LabelWrapper';
import type {CvState, ExperienceKey} from '@/hooks/useCv';
import {  useCv } from '@/hooks/useCv';
import DebouncedTextField from '@/components/debouncedTextfield/DebouncedTextField';

interface Props{
    label1:string
    label2:string
    label3:string
    label4:string
    label5:string
    type: keyof Pick<CvState, ExperienceKey>
    id:string
}

export default function Experience(props:Props){
    const cv = useCv()
    const workExperience = cv[props.type].find(el=> el.id === props.id)
    return <LocalizationProvider dateAdapter={AdapterDayjs}>
        <section className={styles.experience}>
            <section className={styles.row}>
                <LabelWrapper label={props.label1}><DebouncedTextField onChange={el=>{
                    cv.updateWorkExperience(props.type, "tittel", el.target.value, props.id )}} value={workExperience?.tittel} fullWidth/></LabelWrapper>
                <LabelWrapper label={props.label2}><DebouncedTextField onChange={el=>cv.updateWorkExperience(props.type, "institusjon", el.target.value, props.id )} value={workExperience?.institusjon} fullWidth/></LabelWrapper>
            </section>
           
           <section className={styles.row}>
                <LabelWrapper label={props.label3} >
                    <section className={styles.date}>
                        <DatePicker slots={{openPickerIcon:()=>null}} format='MM/YYYY' views={['month', 'year']} />
                        <DatePicker slots={{openPickerIcon:()=>null}} format='MM/YYYY' views={['month', 'year']} />
                    </section>
                    
                </LabelWrapper>
             <LabelWrapper label={props.label4}><DebouncedTextField onChange={el=>cv.updateWorkExperience(props.type, "by", el.target.value, props.id )} value={workExperience?.by} fullWidth/></LabelWrapper>
           </section>
           <section className={styles.row}>
            <LabelWrapper label={props.label5}><DebouncedTextField  onChange={el=>cv.updateWorkExperience(props.type, "beskrivelse", el.target.value, props.id )} value={workExperience?.beskrivelse} fullWidth rows={7} multiline/></LabelWrapper>
           </section>
            
        </section>
    </LocalizationProvider>
}