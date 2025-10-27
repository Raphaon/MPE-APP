import { Router } from 'express';

import { regionRouter } from '@/routes/region.routes';
import { districtRouter } from '@/routes/district.routes';
import { assemblyRouter } from '@/routes/assembly.routes';
import { memberRouter } from '@/routes/member.routes';
import { authRouter } from '@/routes/auth.routes';
import { ministryRouter } from '@/routes/ministry.routes';
import { eventRouter } from '@/routes/event.routes';
import { statsRouter } from '@/routes/statistics.routes';
import { circularRouter } from '@/routes/circular.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/regions', regionRouter);
router.use('/districts', districtRouter);
router.use('/assemblies', assemblyRouter);
router.use('/members', memberRouter);
router.use('/ministries', ministryRouter);
router.use('/events', eventRouter);
router.use('/statistics', statsRouter);
router.use('/circulars', circularRouter);

export default router;
