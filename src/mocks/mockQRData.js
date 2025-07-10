const holder = 'did:example:guardian1234';
const name = '채민주';
const phone = '010-1234-5678';
const relation = 'GUARDIAN';
const memberId = 2001;
const allowedAreas = ['A_03_01', 'A_02_02', 'A_02_03'];

export const qrData_sample = JSON.stringify({
  vp: {
    holder,
    verifiableCredential: {
      credentialSubject: {
        name,
        phone,
        relation,
        memberId,
        allowedAreas,
      },
    },
  },
});
