/* 承心 2017-03-15
** 編輯檢視日期共用元件 依據傳入 InputViewMode 屬性進行切換
*/
import React = require('react');
import { config } from '../def-data';
import moment = require('moment');
import DatePicker = require('react-datepicker');

import Datetime = require('react-datetime');
import '../../node_modules/react-datetime/css/react-datetime.css';

interface DateTimePickTextProps {
    inputViewMode?: InputViewMode
    inputClassName?: string;
    viewClassName?: string;
    disabled?: boolean;
    onChange?: Function;
    value?: string;
    required?: boolean;
    minDate?: moment.Moment;
    maxDate?: moment.Moment;
}
interface DateTimePickTextState {
}
export default class DateTimePickText extends React.Component<DateTimePickTextProps, any>{

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }
    static defaultProps = {
        disabled: false,
        required: false,
        inputViewMode: InputViewMode.edit
    }
    onChange(date: moment.Moment) {

        let value = date == null ? null : date.format();
        this.props.onChange(value, this);
    }
    render() {
        let out_html = null;
        let pp = this.props;
        let value = pp.value == undefined ? null : moment(pp.value).toDate();

        if (this.props.inputViewMode == InputViewMode.edit) {
            out_html =
                (
                    <Datetime value={value}
                        dateFormat={config.dateFT}
                        locale="zh-TW"
                        onChange={this.onChange}
                        timeConstraints={{ minutes: { min: 0, max: 59, step: 10 } }}
                        className={pp.inputClassName} />
                );
        }

        if (this.props.inputViewMode == InputViewMode.view) {
            out_html =
                (
                    <span
                        className={this.props.viewClassName}>
                        {value}
                    </span>
                );
        }
        return out_html;
    }
}