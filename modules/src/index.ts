import { isAdmin, isLiveCourse, observeDOM } from "ccau";

async function main() {
    if (!isAdmin()) {
        throw new Error("Only admins can use CCAU");
    }

    if (await isLiveCourse()) {
        throw new Error("CCAU is disabled in live courses");
    }
}

main();
