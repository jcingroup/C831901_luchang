let gb_culture = 'zh-TW';

export default function loc() {
    if (gb_culture == 'zh-TW') {
        return {

            grid: {
                title: '標題',
                publish_date: '發佈日期',
                sort: '排序',
                state: '狀態'
            }

        }
    } else if (gb_culture == 'en-US') {
        return {

            grid: {
                title: 'Title',
                publish_date: 'Date',
                sort: 'Sort',
                state: 'State'
            }

        }
    } else {
        return {

            grid: {
                title: '標題',
                publish_date: '發佈日期',
                sort: '排序',
                state: 'State'
            }
        }
    }
}