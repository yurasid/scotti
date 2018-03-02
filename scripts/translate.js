import * as fs from 'fs';
import { sync as globSync } from 'glob';
import { sync as mkdirpSync } from 'mkdirp';

import { 
    CONCIERGE_MESSAGES_PATTERN, 
    CONCIERGE_LANG_DIR, 
    TERMINAL_MESSAGES_PATTERN,
    TERMINAL_LANG_DIR
} from '../config/constants';

const getMessages = (pattern) => {
    return globSync(pattern)
        .map((filename) => fs.readFileSync(filename, 'utf8'))
        .map((file) => JSON.parse(file))
        .reduce((collection, descriptors) => {
            descriptors.forEach(({ id, defaultMessage }) => {
                if (collection.hasOwnProperty(id)) {
                    throw new Error(`Duplicate message id: ${id}`);
                }

                collection[id] = defaultMessage;
            });

            return collection;
        }, {});
};

const conciergeMessages = getMessages(CONCIERGE_MESSAGES_PATTERN);
const terminalMessages = getMessages(TERMINAL_MESSAGES_PATTERN);

mkdirpSync(CONCIERGE_LANG_DIR);
fs.writeFileSync(`${CONCIERGE_LANG_DIR}/en.json`, JSON.stringify(conciergeMessages, null, 2));

mkdirpSync(TERMINAL_LANG_DIR);
fs.writeFileSync(`${TERMINAL_LANG_DIR}/en.json`, JSON.stringify(terminalMessages, null, 2));